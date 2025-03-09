import React, { useEffect, useState } from 'react';
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import './ViewFeedback.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feedbacks'); // 'feedbacks' or 'analytics'
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch feedbacks
        const feedbackResponse = await axios.get("http://localhost:5000/api/feedback/all");
        setFeedbacks(feedbackResponse.data);
        
        // Fetch analytics
        const analyticsResponse = await axios.get("http://localhost:5000/api/feedback/analytics");
        setAnalytics(analyticsResponse.data);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load data. Please try again.");
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Transform data for charts
  const prepareSentimentData = () => {
    if (!analytics) return [];
    
    const { sentimentDistribution } = analytics;
    return [
      { name: 'Positive', value: sentimentDistribution.positive },
      { name: 'Neutral', value: sentimentDistribution.neutral },
      { name: 'Negative', value: sentimentDistribution.negative }
    ];
  };

  const prepareTopicData = () => {
    if (!analytics) return [];
    
    const { topicDistribution } = analytics;
    return Object.entries(topicDistribution).map(([topic, count]) => ({
      name: topic.charAt(0).toUpperCase() + topic.slice(1),
      value: count
    }));
  };

  const prepareTrendData = () => {
    if (!analytics) return [];
    
    const { sentimentTrend } = analytics;
    return Object.entries(sentimentTrend).map(([month, data]) => ({
      month,
      positive: data.positive,
      neutral: data.neutral,
      negative: data.negative,
      positiveRate: Math.round((data.positive / data.total) * 100),
      negativeRate: Math.round((data.negative / data.total) * 100)
    }));
  };

  // Colors for charts
  const SENTIMENT_COLORS = ['#4CAF50', '#FFC107', '#F44336'];
  const TOPIC_COLORS = ['#2196F3', '#9C27B0', '#FF9800', '#795548', '#009688', '#607D8B', '#E91E63', '#3F51B5'];

  // Sentiment badge color
  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'positive': return '#e6f7e6';
      case 'negative': return '#ffebeb';
      case 'neutral': return '#fff9e6';
      default: return '#f0f0f0';
    }
  };

  const getSentimentTextColor = (sentiment) => {
    switch(sentiment) {
      case 'positive': return '#4CAF50';
      case 'negative': return '#F44336';
      case 'neutral': return '#FFC107';
      default: return '#757575';
    }
  };

  if (isLoading) return (
    <div>
      <Header/>
      <Sidebar/>
      <div className="view-feedback">
        <h2>Loading data...</h2>
      </div>
    </div>
  );

  if (error) return (
    <div>
      <Header/>
      <Sidebar/>
      <div className="view-feedback">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div>
      <Header/>
      <Sidebar/>
      <div className="view-feedback admin-feedback-container">
        <div className="feedback-tabs">
          <button 
            className={`tab-button ${activeTab === 'feedbacks' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedbacks')}
          >
            Feedbacks List
          </button>
          <button 
            className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Feedback Analytics
          </button>
        </div>

        {activeTab === 'feedbacks' && (
          <div className="feedback-list-container">
            <h2>Customer Feedbacks</h2>
            <table className="feedback-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Feedback</th>
                  {analytics && <th>Sentiment</th>}
                  {analytics && <th>Topics</th>}
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((fb, index) => (
                  <tr key={index}>
                    <td>{fb.name}</td>
                    <td>{fb.mobile}</td>
                    <td>{fb.email}</td>
                    <td>{fb.feedback}</td>
                    {analytics && (
                      <td>
                        <span 
                          className="sentiment-badge"
                          style={{
                            backgroundColor: getSentimentColor(fb.sentiment),
                            color: getSentimentTextColor(fb.sentiment)
                          }}
                        >
                          {fb.sentiment || 'N/A'}
                        </span>
                      </td>
                    )}
                    {analytics && (
                      <td>
                        <div className="topics-container">
                          {fb.topics && fb.topics.map((topic, i) => (
                            <span key={i} className="topic-badge">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </td>
                    )}
                    <td>{new Date(fb.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'analytics' && analytics && (
          <div className="analytics-container">
            <h2>Feedback Analytics Dashboard</h2>
            
            {/* Summary Cards */}
            <div className="summary-cards">
              <div className="summary-card total">
                <h3>Total Feedback</h3>
                <p className="summary-value">{analytics.totalFeedback}</p>
              </div>
              <div className="summary-card positive">
                <h3>Positive Feedback</h3>
                <p className="summary-value">{analytics.sentimentDistribution.positive}</p>
                <p className="summary-percentage">
                  ({Math.round((analytics.sentimentDistribution.positive / analytics.totalFeedback) * 100)}%)
                </p>
              </div>
              <div className="summary-card negative">
                <h3>Negative Feedback</h3>
                <p className="summary-value">{analytics.sentimentDistribution.negative}</p>
                <p className="summary-percentage">
                  ({Math.round((analytics.sentimentDistribution.negative / analytics.totalFeedback) * 100)}%)
                </p>
              </div>
            </div>
            
            {/* Charts Section */}
            <div className="charts-container">
              {/* Sentiment Distribution */}
              <div className="chart-box">
                <h3>Sentiment Distribution</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={prepareSentimentData()}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {prepareSentimentData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Topic Distribution */}
              <div className="chart-box">
                <h3>Common Topics</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={prepareTopicData()}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {prepareTopicData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={TOPIC_COLORS[index % TOPIC_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Sentiment Trend Over Time */}
            <div className="chart-box full-width">
              <h3>Sentiment Trend (Last 6 Months)</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={prepareTrendData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="positiveRate" name="Positive %" stroke="#4CAF50" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="negativeRate" name="Negative %" stroke="#F44336" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Action Items */}
            <div className="action-items-container">
              <h3>Suggested Action Items</h3>
              <div className="action-items-list">
                {prepareTopicData().length > 0 && prepareTopicData()
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 3)
                  .map((topic, index) => {
                    let recommendationText = '';
                    switch (topic.name.toLowerCase()) {
                      case 'schedule':
                        recommendationText = 'Improve bus schedule accuracy and communication about delays';
                        break;
                      case 'cleanliness':
                        recommendationText = 'Enhance cleaning protocols for buses';
                        break;
                      case 'comfort':
                        recommendationText = 'Assess seating comfort and climate control in vehicles';
                        break;
                      case 'staff':
                        recommendationText = 'Review staff training for customer service';
                        break;
                      case 'safety':
                        recommendationText = 'Evaluate safety protocols and driver behavior';
                        break;
                      case 'app':
                        recommendationText = 'Address app technical issues and user experience';
                        break;
                      case 'price':
                        recommendationText = 'Review pricing strategy and communication';
                        break;
                      case 'tracking':
                        recommendationText = 'Improve accuracy of bus tracking features';
                        break;
                      default:
                        recommendationText = `Review ${topic.name.toLowerCase()} related feedback`;
                    }
                    
                    return (
                      <div key={index} className="action-item">
                        <h4>{topic.name} ({topic.value})</h4>
                        <p>{recommendationText}</p>
                      </div>
                    );
                  })}
                  
                {analytics.sentimentDistribution.negative > analytics.sentimentDistribution.positive && (
                  <div className="action-item warning">
                    <h4>Overall Sentiment Alert</h4>
                    <p>Negative feedback exceeds positive feedback. Consider a company-wide review of service quality.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewFeedback;