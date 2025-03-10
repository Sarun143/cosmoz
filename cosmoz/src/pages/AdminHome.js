import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './AdminHome.css';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Users, Bus, Calendar, Tag, Activity } from 'lucide-react';

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
        
        // In a real implementation, these would be actual API calls
        // For demo purposes, we're using mock data based on your provided code
        
        // Simulate staff data fetch
        const staffResponse = await simulateFetch('/api/staff/summary');
        
        // Simulate bus data fetch
        const busResponse = await simulateFetch('/api/buses/summary');
        
        // Simulate leave requests fetch
        const leaveResponse = await simulateFetch('/api/staff/leave/summary');
        
        // Simulate feedback analytics fetch
        const feedbackResponse = await simulateFetch('/api/feedback/analytics/summary');
        
        // Simulate promotions fetch
        const promotionsResponse = await simulateFetch('/api/promotions/summary');
        
        setDashboardData({
          staffSummary: staffResponse.data,
          busSummary: busResponse.data,
          leaveRequests: leaveResponse.data,
          feedbackAnalytics: feedbackResponse.data,
          promotions: promotionsResponse.data
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

  // Helper function to simulate API responses
  const simulateFetch = async (endpoint) => {
    // In a real implementation, this would be an axios call
    // For demo purposes, we're returning mock data
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    const mockData = {
      '/api/staff/summary': {
        data: {
          total: 42,
          onDuty: 28,
          drivers: 25,
          conductors: 17,
          roleDistribution: [
            { name: 'Drivers', value: 25 },
            { name: 'Conductors', value: 17 }
          ],
          attendanceData: [
            { month: 'Jan', present: 92, absent: 8 },
            { month: 'Feb', present: 89, absent: 11 },
            { month: 'Mar', present: 94, absent: 6 },
            { month: 'Apr', present: 91, absent: 9 },
            { month: 'May', present: 88, absent: 12 },
            { month: 'Jun', present: 93, absent: 7 }
          ]
        }
      },
      '/api/buses/summary': {
        data: {
          total: 35,
          active: 28,
          maintenance: 7,
          upcoming: { tax: 3, insurance: 2, pollution: 4 },
          statusDistribution: [
            { name: 'Active', value: 28 },
            { name: 'Maintenance', value: 7 }
          ],
          busTypes: [
            { name: 'Double Decker', value: 12 },
            { name: 'Single Deck', value: 23 }
          ],
          expiryData: [
            { name: 'Tax', upcoming: 3 },
            { name: 'Insurance', upcoming: 2 },
            { name: 'Pollution', upcoming: 4 }
          ]
        }
      },
      '/api/staff/leave/summary': {
        data: {
          total: 24,
          pending: 7,
          approved: 12,
          rejected: 5,
          statusDistribution: [
            { name: 'Pending', value: 7 },
            { name: 'Approved', value: 12 },
            { name: 'Rejected', value: 5 }
          ],
          monthlyData: [
            { month: 'Jan', leaves: 5 },
            { month: 'Feb', leaves: 7 },
            { month: 'Mar', leaves: 3 },
            { month: 'Apr', leaves: 4 },
            { month: 'May', leaves: 6 },
            { month: 'Jun', leaves: 9 }
          ]
        }
      },
      '/api/feedback/analytics/summary': {
        data: {
          totalFeedback: 325,
          sentimentDistribution: { positive: 185, neutral: 75, negative: 65 },
          pieData: [
            { name: 'Positive', value: 185 },
            { name: 'Neutral', value: 75 },
            { name: 'Negative', value: 65 }
          ],
          sentimentTrend: [
            { month: 'Jan', positive: 75, neutral: 15, negative: 10 },
            { month: 'Feb', positive: 70, neutral: 20, negative: 10 },
            { month: 'Mar', positive: 65, neutral: 20, negative: 15 },
            { month: 'Apr', positive: 60, neutral: 25, negative: 15 },
            { month: 'May', positive: 55, neutral: 25, negative: 20 },
            { month: 'Jun', positive: 50, neutral: 30, negative: 20 }
          ],
          topicDistribution: {
            schedule: 85,
            cleanliness: 65,
            staff: 45,
            comfort: 50,
            app: 40,
            safety: 30,
            price: 10
          }
        }
      },
      '/api/promotions/summary': {
        data: {
          active: 4,
          upcoming: 2,
          expired: 8,
          statusDistribution: [
            { name: 'Active', value: 4 },
            { name: 'Upcoming', value: 2 },
            { name: 'Expired', value: 8 }
          ],
          revenueImpact: [
            { month: 'Jan', withPromo: 125000, withoutPromo: 100000 },
            { month: 'Feb', withPromo: 135000, withoutPromo: 105000 },
            { month: 'Mar', withPromo: 150000, withoutPromo: 110000 },
            { month: 'Apr', withPromo: 145000, withoutPromo: 108000 },
            { month: 'May', withPromo: 160000, withoutPromo: 118000 },
            { month: 'Jun', withPromo: 172000, withoutPromo: 125000 }
          ]
        }
      }
    };
    
    return mockData[endpoint] || { data: {} };
  };

  // Color schemes
  const STAFF_COLORS = ['#2196F3', '#FF9800'];
  const BUS_COLORS = ['#4CAF50', '#F44336'];
  const LEAVE_COLORS = ['#FFC107', '#4CAF50', '#F44336'];
  const SENTIMENT_COLORS = ['#4CAF50', '#FFC107', '#F44336'];
  const PROMOTION_COLORS = ['#4CAF50', '#2196F3', '#9E9E9E'];

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <Sidebar/>
      <Header/>
      <div className="text-xl">Loading dashboard data...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-xl text-red-500">{error}</div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of all system metrics and data</p>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <Users size={24} className="text-blue-500" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Staff</p>
            <h3 className="text-2xl font-bold">{dashboardData.staffSummary.total}</h3>
            <p className="text-sm text-blue-500">{dashboardData.staffSummary.onDuty} on duty</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <Bus size={24} className="text-green-500" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Buses</p>
            <h3 className="text-2xl font-bold">{dashboardData.busSummary.total}</h3>
            <p className="text-sm text-green-500">{dashboardData.busSummary.active} active</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="bg-yellow-100 p-3 rounded-full mr-4">
            <Calendar size={24} className="text-yellow-500" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Leave Requests</p>
            <h3 className="text-2xl font-bold">{dashboardData.leaveRequests.total}</h3>
            <p className="text-sm text-yellow-500">{dashboardData.leaveRequests.pending} pending</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <Tag size={24} className="text-purple-500" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Active Promotions</p>
            <h3 className="text-2xl font-bold">{dashboardData.promotions.active}</h3>
            <p className="text-sm text-purple-500">{dashboardData.promotions.upcoming} upcoming</p>
          </div>
        </div>
      </div>
      
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Staff Role Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Staff Role Distribution</h3>
          <div className="h-64">
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Bus Status Distribution</h3>
          <div className="h-64">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Staff Attendance Trend */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Staff Attendance Trend</h3>
          <div className="h-64">
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Leave Requests by Month</h3>
          <div className="h-64">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Feedback Sentiment Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Feedback Sentiment Analysis</h3>
          <div className="h-64">
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
        
        {/* Promotion Impact on Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Promotion Impact on Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dashboardData.promotions.revenueImpact}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="withPromo" name="With Promotions" stroke="#4CAF50" strokeWidth={2} />
                <Line type="monotone" dataKey="withoutPromo" name="Without Promotions" stroke="#9E9E9E" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Alert Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center mb-4">
          <Activity size={24} className="text-red-500 mr-2" />
          <h3 className="text-lg font-semibold">Alerts & Notifications</h3>
        </div>
        
        <div className="space-y-4">
          {dashboardData.busSummary.upcoming.tax > 0 && (
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    {dashboardData.busSummary.upcoming.tax} buses have tax documents expiring soon
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {dashboardData.busSummary.upcoming.insurance > 0 && (
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    {dashboardData.busSummary.upcoming.insurance} buses have insurance expiring soon
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {dashboardData.leaveRequests.pending > 0 && (
            <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    {dashboardData.leaveRequests.pending} leave requests pending approval
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {dashboardData.feedbackAnalytics.sentimentDistribution.negative > 50 && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    High negative feedback rate detected. Review customer concerns.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;