import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const FeedbackAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/feedback/analytics');
        setAnalytics(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load feedback analytics');
        setLoading(false);
        console.error(err);
      }
    };

    fetchAnalytics();
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

  if (loading) return <div className="p-4">Loading analytics...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!analytics) return <div className="p-4">No feedback data available</div>;

  // Prepare data for charts
  const sentimentData = prepareSentimentData();
  const topicData = prepareTopicData();
  const trendData = prepareTrendData();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Feedback Analysis Dashboard</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold text-blue-800">Total Feedback</h3>
          <p className="text-3xl font-bold">{analytics.totalFeedback}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold text-green-800">Positive Feedback</h3>
          <p className="text-3xl font-bold">{analytics.sentimentDistribution.positive}</p>
          <p className="text-sm">
            ({Math.round((analytics.sentimentDistribution.positive / analytics.totalFeedback) * 100)}%)
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold text-red-800">Negative Feedback</h3>
          <p className="text-3xl font-bold">{analytics.sentimentDistribution.negative}</p>
          <p className="text-sm">
            ({Math.round((analytics.sentimentDistribution.negative / analytics.totalFeedback) * 100)}%)
          </p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sentiment Distribution */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-4">Sentiment Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Topic Distribution */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-4">Common Topics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topicData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {topicData.map((entry, index) => (
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
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Sentiment Trend (6 Months)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="positiveRate" name="Positive %" stroke="#4CAF50" />
              <Line type="monotone" dataKey="negativeRate" name="Negative %" stroke="#F44336" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Recent Feedback with Sentiment */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-4">Action Items</h3>
        <div className="space-y-2">
          <p className="font-medium">Based on feedback analysis, consider focusing on:</p>
          
          {topicData.length > 0 && topicData
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
                <div key={index} className="p-2 border-l-4 border-blue-500 bg-blue-50">
                  <p className="font-medium">{topic.name} ({topic.value})</p>
                  <p className="text-sm text-gray-700">{recommendationText}</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default FeedbackAnalytics;