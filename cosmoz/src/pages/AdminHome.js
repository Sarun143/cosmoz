import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './AdminHome.css';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Users, Bus, Calendar, Tag, Activity, MessageSquare } from 'lucide-react';

const AdminHome = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    staffSummary: { total: 0, onDuty: 0, drivers: 0, conductors: 0 },
    busSummary: { total: 0, active: 0, maintenance: 0, upcoming: { tax: 0, insurance: 0, pollution: 0 } },
    leaveRequests: { total: 0, pending: 0, approved: 0, rejected: 0 },
    feedbackAnalytics: { totalFeedback: 0, sentimentDistribution: { positive: 0, neutral: 0, negative: 0 } },
    promotions: { active: 0, upcoming: 0, expired: 0 }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch staff data
        const staffResponse = await axios.get('http://localhost:5000/api/vstaff/view');
        const staffData = staffResponse.data || [];
        
        // Fetch bus data
        const busResponse = await axios.get('http://localhost:5000/api/buses/viewvehicle');
        const busData = busResponse.data || [];
        
        // Fetch leave requests
        const leaveResponse = await axios.get('http://localhost:5000/api/staff/viewleaves');
        const leaveData = leaveResponse.data?.leaveRequests || [];
        
        // Fetch feedback analytics
        const feedbackResponse = await axios.get('http://localhost:5000/api/feedback/analytics');
        const feedbackData = feedbackResponse.data || {};
        
        // Fetch promotions
        const promotionsResponse = await axios.get('http://localhost:5000/api/promotions');
        const promotionsData = promotionsResponse.data || [];
        
        // Fetch notifications for document expiry
        const notificationsResponse = await axios.get('http://localhost:5000/api/notification/notifications');
        const notificationsData = notificationsResponse.data || [];
        
        // Process staff data
        const onDutyStaff = staffData.filter(staff => staff.onDuty).length;
        const drivers = staffData.filter(staff => staff.role === 'driver').length;
        const conductors = staffData.filter(staff => staff.role === 'conductor').length;
        
        // Process bus data
        const activeBuses = busData.filter(bus => bus.status === 'Active').length;
        const maintenanceBuses = busData.filter(bus => bus.status === 'Maintenance').length;
        
        // Process document expiry notifications
        const taxExpiring = notificationsData.filter(n => n.documentType === 'Tax').length;
        const insuranceExpiring = notificationsData.filter(n => n.documentType === 'Insurance').length;
        const pollutionExpiring = notificationsData.filter(n => n.documentType === 'Pollution').length;
        
        // Process leave requests
        const pendingLeaves = leaveData.filter(leave => leave.status === 'Pending').length;
        const approvedLeaves = leaveData.filter(leave => leave.status === 'Approved').length;
        const rejectedLeaves = leaveData.filter(leave => leave.status === 'Rejected').length;
        
        // Process promotions
        const currentDate = new Date();
        const activePromotions = promotionsData.filter(promo => 
          promo.isActive && new Date(promo.startDate) <= currentDate && new Date(promo.endDate) >= currentDate
        ).length;
        const upcomingPromotions = promotionsData.filter(promo => 
          new Date(promo.startDate) > currentDate
        ).length;
        const expiredPromotions = promotionsData.filter(promo => 
          new Date(promo.endDate) < currentDate
        ).length;
        
        // Prepare data for charts
        const staffRoleDistribution = [
          { name: 'Drivers', value: drivers },
          { name: 'Conductors', value: conductors }
        ];
        
        const busStatusDistribution = [
          { name: 'Active', value: activeBuses },
          { name: 'Maintenance', value: maintenanceBuses }
        ];
        
        const leaveStatusDistribution = [
          { name: 'Pending', value: pendingLeaves },
          { name: 'Approved', value: approvedLeaves },
          { name: 'Rejected', value: rejectedLeaves }
        ];
        
        // Use feedback sentiment data from the API if available
        const sentimentData = feedbackData.sentimentDistribution ? [
          { name: 'Positive', value: feedbackData.sentimentDistribution.positive },
          { name: 'Neutral', value: feedbackData.sentimentDistribution.neutral },
          { name: 'Negative', value: feedbackData.sentimentDistribution.negative }
        ] : [];
        
        // Set the dashboard data
        setDashboardData({
          staffSummary: {
            total: staffData.length,
            onDuty: onDutyStaff,
            drivers,
            conductors,
            roleDistribution: staffRoleDistribution,
            // Mock attendance data (replace with real data when available)
            attendanceData: [
              { month: 'Jan', present: 92, absent: 8 },
              { month: 'Feb', present: 89, absent: 11 },
              { month: 'Mar', present: 94, absent: 6 },
              { month: 'Apr', present: 91, absent: 9 },
              { month: 'May', present: 88, absent: 12 },
              { month: 'Jun', present: 93, absent: 7 }
            ]
          },
          busSummary: {
            total: busData.length,
            active: activeBuses,
            maintenance: maintenanceBuses,
            upcoming: { 
              tax: taxExpiring, 
              insurance: insuranceExpiring, 
              pollution: pollutionExpiring 
            },
            statusDistribution: busStatusDistribution,
            expiryData: [
              { name: 'Tax', upcoming: taxExpiring },
              { name: 'Insurance', upcoming: insuranceExpiring },
              { name: 'Pollution', upcoming: pollutionExpiring }
            ]
          },
          leaveRequests: {
            total: leaveData.length,
            pending: pendingLeaves,
            approved: approvedLeaves,
            rejected: rejectedLeaves,
            statusDistribution: leaveStatusDistribution,
            // Group leave requests by month
            monthlyData: getMonthlyLeaveData(leaveData)
          },
          feedbackAnalytics: {
            totalFeedback: feedbackData.totalFeedback || 0,
            sentimentDistribution: feedbackData.sentimentDistribution || { positive: 0, neutral: 0, negative: 0 },
            pieData: sentimentData,
            sentimentTrend: feedbackData.sentimentTrend ? 
              Object.entries(feedbackData.sentimentTrend).map(([month, data]) => ({
                month,
                positive: data.positive,
                neutral: data.neutral,
                negative: data.negative
              })) : []
          },
          promotions: {
            active: activePromotions,
            upcoming: upcomingPromotions,
            expired: expiredPromotions,
            statusDistribution: [
              { name: 'Active', value: activePromotions },
              { name: 'Upcoming', value: upcomingPromotions },
              { name: 'Expired', value: expiredPromotions }
            ],
            // Mock revenue impact data (replace with real data when available)
            revenueImpact: [
              { month: 'Jan', withPromo: 125000, withoutPromo: 100000 },
              { month: 'Feb', withPromo: 135000, withoutPromo: 105000 },
              { month: 'Mar', withPromo: 150000, withoutPromo: 110000 },
              { month: 'Apr', withPromo: 145000, withoutPromo: 108000 },
              { month: 'May', withPromo: 160000, withoutPromo: 118000 },
              { month: 'Jun', withPromo: 172000, withoutPromo: 125000 }
            ]
          }
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to group leave requests by month
  const getMonthlyLeaveData = (leaveData) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map(month => ({ month, leaves: 0 }));
    
    leaveData.forEach(leave => {
      const date = new Date(leave.startDate);
      const monthIndex = date.getMonth();
      monthlyData[monthIndex].leaves += 1;
    });
    
    return monthlyData.slice(0, 6); // Return only first 6 months for display
  };

  // Color schemes
  const STAFF_COLORS = ['#2196F3', '#FF9800'];
  const BUS_COLORS = ['#4CAF50', '#F44336'];
  const LEAVE_COLORS = ['#FFC107', '#4CAF50', '#F44336'];
  const SENTIMENT_COLORS = ['#4CAF50', '#FFC107', '#F44336'];
  const PROMOTION_COLORS = ['#4CAF50', '#2196F3', '#9E9E9E'];

  if (loading) return (
    <div className="admin-dashboard-container">
      <Sidebar/>
      <Header/>
      <div className="loading-container">
        <div className="loading-message">Loading dashboard data...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="admin-dashboard-container">
      <Sidebar/>
      <Header/>
      <div className="error-container">
        <div className="error-message">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard-container">
      <Sidebar />
      <Header />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Overview of all system metrics and data</p>
      </div>
      
      {/* Overview Cards */}
        <div className="overview-cards">
          <div className="card">
            <div className="card-icon staff-icon">
              <Users size={24} />
            </div>
            <div className="card-content">
              <p className="card-label">Total Staff</p>
              <h3 className="card-value">{dashboardData.staffSummary.total}</h3>
              <p className="card-subtext">{dashboardData.staffSummary.onDuty} on duty</p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-icon bus-icon">
              <Bus size={24} />
          </div>
            <div className="card-content">
              <p className="card-label">Total Buses</p>
              <h3 className="card-value">{dashboardData.busSummary.total}</h3>
              <p className="card-subtext">{dashboardData.busSummary.active} active</p>
        </div>
          </div>
          
          <div className="card">
            <div className="card-icon leave-icon">
              <Calendar size={24} />
          </div>
            <div className="card-content">
              <p className="card-label">Leave Requests</p>
              <h3 className="card-value">{dashboardData.leaveRequests.total}</h3>
              <p className="card-subtext">{dashboardData.leaveRequests.pending} pending</p>
        </div>
          </div>
          
          <div className="card">
            <div className="card-icon promo-icon">
              <Tag size={24} />
            </div>
            <div className="card-content">
              <p className="card-label">Active Promotions</p>
              <h3 className="card-value">{dashboardData.promotions.active}</h3>
              <p className="card-subtext">{dashboardData.promotions.upcoming} upcoming</p>
            </div>
          </div>
          
          {/* New Feedback Summary Card */}
          <div className="card">
            <div className="card-icon feedback-icon">
              <MessageSquare size={24} />
        </div>
            <div className="card-content">
              <p className="card-label">Feedback</p>
              <h3 className="card-value">{dashboardData.feedbackAnalytics.totalFeedback}</h3>
              <p className="card-subtext">
                {dashboardData.feedbackAnalytics.sentimentDistribution.positive} positive
              </p>
          </div>
        </div>
      </div>
      
      {/* Charts Row 1 */}
        <div className="charts-row">
        {/* Staff Role Distribution */}
          <div className="chart-card">
            <h3>Staff Role Distribution</h3>
            <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.staffSummary.roleDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.staffSummary.roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STAFF_COLORS[index % STAFF_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Bus Status Distribution */}
          <div className="chart-card">
            <h3>Bus Status Distribution</h3>
            <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.busSummary.statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.busSummary.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BUS_COLORS[index % BUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Charts Row 2 */}
        <div className="charts-row">
        {/* Staff Attendance Trend */}
          <div className="chart-card">
            <h3>Staff Attendance Trend</h3>
            <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dashboardData.staffSummary.attendanceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" name="Present %" fill="#4CAF50" />
                <Bar dataKey="absent" name="Absent %" fill="#F44336" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Leave Requests by Month */}
          <div className="chart-card">
            <h3>Leave Requests by Month</h3>
            <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dashboardData.leaveRequests.monthlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="leaves" name="Leave Requests" stroke="#FFC107" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Charts Row 3 */}
        <div className="charts-row">
        {/* Feedback Sentiment Distribution */}
          <div className="chart-card">
            <h3>Feedback Sentiment Analysis</h3>
            <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.feedbackAnalytics.pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.feedbackAnalytics.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
          {/* Document Expiry Alerts */}
          <div className="chart-card">
            <h3>Document Expiry Alerts</h3>
            <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData.busSummary.expiryData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                <YAxis />
                  <Tooltip />
                <Legend />
                  <Bar dataKey="upcoming" name="Documents Expiring Soon" fill="#FF9800" />
                </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Alert Section */}
        <div className="alerts-section">
          <div className="alerts-header">
            <Activity size={24} className="alert-icon" />
            <h3>Alerts & Notifications</h3>
        </div>
        
          <div className="alerts-container">
          {dashboardData.busSummary.upcoming.tax > 0 && (
              <div className="alert tax-alert">
                <div className="alert-icon-container">
                  <svg className="alert-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="alert-content">
                  <p>{dashboardData.busSummary.upcoming.tax} buses have tax documents expiring soon</p>
              </div>
            </div>
          )}
          
          {dashboardData.busSummary.upcoming.insurance > 0 && (
              <div className="alert insurance-alert">
                <div className="alert-icon-container">
                  <svg className="alert-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="alert-content">
                  <p>{dashboardData.busSummary.upcoming.insurance} buses have insurance expiring soon</p>
              </div>
            </div>
          )}
          
          {dashboardData.leaveRequests.pending > 0 && (
              <div className="alert leave-alert">
                <div className="alert-icon-container">
                  <svg className="alert-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="alert-content">
                  <p>{dashboardData.leaveRequests.pending} leave requests pending approval</p>
              </div>
            </div>
          )}
          
          {dashboardData.feedbackAnalytics.sentimentDistribution.negative > 50 && (
              <div className="alert feedback-alert">
                <div className="alert-icon-container">
                  <svg className="alert-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="alert-content">
                  <p>High negative feedback rate detected. Review customer concerns.</p>
                </div>
              </div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;