import React, { useState, useEffect } from 'react';
import { adminAPI, publicAPI } from '../../utils/api';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  PhoneIcon,
  PhotoIcon,
  CalendarIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalUsers: 0,
      totalAdmissions: 0,
      totalContacts: 0,
      totalGalleryImages: 0,
      monthlyGrowth: 0,
      activeUsers: 0
    },
    admissionsTrend: [],
    contactsTrend: [],
    topCategories: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from various APIs
      const [admissionsRes, contactsRes, galleryRes] = await Promise.all([
        adminAPI.getAdmissions(),
        publicAPI.getContacts(),
        publicAPI.getGallery()
      ]);

      const admissions = admissionsRes.data?.admissions || [];
      const contacts = contactsRes.data?.contacts || [];
      const gallery = galleryRes.data?.images || [];

      // Process data for analytics
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

      const recentAdmissions = admissions.filter(a => new Date(a.createdAt) > thirtyDaysAgo);
      const recentContacts = contacts.filter(c => new Date(c.createdAt) > thirtyDaysAgo);
      const recentGallery = gallery.filter(g => new Date(g.createdAt) > thirtyDaysAgo);

      // Calculate trends
      const admissionsTrend = calculateTrend(admissions, 'submittedAt');
      const contactsTrend = calculateTrend(contacts, 'createdAt');

      // Top categories from gallery
      const categoryCount = gallery.reduce((acc, img) => {
        acc[img.category] = (acc[img.category] || 0) + 1;
        return acc;
      }, {});
      const topCategories = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

      // Recent activity
      const recentActivity = [
        ...recentAdmissions.map(a => ({
          type: 'admission',
          title: `New admission: ${a.firstName} ${a.lastName}`,
          time: new Date(a.createdAt),
          status: a.status
        })),
        ...recentContacts.map(c => ({
          type: 'contact',
          title: `Contact inquiry: ${c.name}`,
          time: new Date(c.createdAt),
          status: 'new'
        })),
        ...recentGallery.map(g => ({
          type: 'gallery',
          title: `New image: ${g.title}`,
          time: new Date(g.createdAt),
          status: 'active'
        }))
      ].sort((a, b) => b.time - a.time).slice(0, 10);

      setAnalyticsData({
        overview: {
          totalUsers: admissions.filter(a => a.status === 'approved').length,
          totalAdmissions: admissions.length,
          totalContacts: contacts.length,
          totalGalleryImages: gallery.length,
          monthlyGrowth: Math.round(((recentAdmissions.length / Math.max(admissions.length, 1)) * 100)),
          activeUsers: admissions.filter(a => a.status === 'approved').length
        },
        admissionsTrend,
        contactsTrend,
        topCategories,
        recentActivity
      });

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTrend = (data, dateField) => {
    const last7Days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const count = data.filter(item => {
        const itemDate = new Date(item[dateField]);
        return itemDate >= dayStart && itemDate <= dayEnd;
      }).length;
      
      last7Days.push({
        date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count
      });
    }
    
    return last7Days;
  };

  const exportToCSV = async () => {
    try {
      setExporting(true);
      
      // Generate report data
      const reportData = {
        generatedAt: new Date().toISOString(),
        timeRange: timeRange,
        overview: analyticsData.overview,
        admissionsTrend: analyticsData.admissionsTrend,
        contactsTrend: analyticsData.contactsTrend,
        topCategories: analyticsData.topCategories,
        recentActivity: analyticsData.recentActivity
      };

      // Create CSV content
      let csvContent = "Janashiri LMS Analytics Report\n";
      csvContent += `Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
      csvContent += `Time Range: ${timeRange}\n\n`;

      // Overview Section
      csvContent += "OVERVIEW STATISTICS\n";
      csvContent += "Metric,Value\n";
      csvContent += `Total Students,${analyticsData.overview.totalUsers}\n`;
      csvContent += `Total Admissions,${analyticsData.overview.totalAdmissions}\n`;
      csvContent += `Contact Inquiries,${analyticsData.overview.totalContacts}\n`;
      csvContent += `Gallery Images,${analyticsData.overview.totalGalleryImages}\n`;
      csvContent += `Monthly Growth,${analyticsData.overview.monthlyGrowth}%\n`;
      csvContent += `Active Users,${analyticsData.overview.activeUsers}\n\n`;

      // Admissions Trend Section
      csvContent += "ADMISSIONS TREND (Last 7 Days)\n";
      csvContent += "Date,Admissions Count\n";
      analyticsData.admissionsTrend.forEach(day => {
        csvContent += `${day.date},${day.count}\n`;
      });
      csvContent += "\n";

      // Contacts Trend Section
      csvContent += "CONTACTS TREND (Last 7 Days)\n";
      csvContent += "Date,Contacts Count\n";
      analyticsData.contactsTrend.forEach(day => {
        csvContent += `${day.date},${day.count}\n`;
      });
      csvContent += "\n";

      // Top Categories Section
      csvContent += "TOP GALLERY CATEGORIES\n";
      csvContent += "Category,Image Count\n";
      analyticsData.topCategories.forEach(category => {
        csvContent += `${category.category},${category.count}\n`;
      });
      csvContent += "\n";

      // Recent Activity Section
      csvContent += "RECENT ACTIVITY\n";
      csvContent += "Type,Title,Date,Time,Status\n";
      analyticsData.recentActivity.forEach(activity => {
        const date = activity.time.toLocaleDateString();
        const time = activity.time.toLocaleTimeString();
        csvContent += `${activity.type},"${activity.title}",${date},${time},${activity.status}\n`;
      });

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      
      const filename = `janashiri_analytics_report_${new Date().toISOString().split('T')[0]}_${timeRange}.csv`;
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      alert(`Analytics report exported successfully! \nFile: ${filename}\nLocation: Downloads folder`);

    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="card p-6 mb-8 bg-gradient-to-r from-primary-50 to-secondary-50 border-0">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-lg">
                <ChartBarIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                  Analytics & Reports
                </h1>
                <p className="text-neutral-600">
                  Monitor your institute's performance and growth
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="form-select bg-white/80 backdrop-blur-sm border-neutral-200 focus:border-primary-300 focus:ring-primary-200 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button 
                onClick={exportToCSV}
                disabled={exporting || loading}
                className={`btn-primary flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-lg ${
                  exporting || loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {exporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <DocumentChartBarIcon className="w-4 h-4" />
                    <span>Export Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-0 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <UserGroupIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total Students</p>
              <p className="text-2xl font-bold text-neutral-900 mb-2">{analyticsData.overview.totalUsers}</p>
              <div className="flex items-center">
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{analyticsData.overview.monthlyGrowth}% this month</span>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-secondary-50 to-secondary-100 border-0 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-lg">
                <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total Admissions</p>
              <p className="text-2xl font-bold text-neutral-900 mb-2">{analyticsData.overview.totalAdmissions}</p>
              <p className="text-sm text-neutral-500">All time</p>
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-0 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <PhoneIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-neutral-600 mb-1">Contact Inquiries</p>
              <p className="text-2xl font-bold text-neutral-900 mb-2">{analyticsData.overview.totalContacts}</p>
              <p className="text-sm text-neutral-500">Total received</p>
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-0 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <PhotoIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm text-neutral-600 mb-1">Gallery Images</p>
              <p className="text-2xl font-bold text-neutral-900 mb-2">{analyticsData.overview.totalGalleryImages}</p>
              <p className="text-sm text-neutral-500">Published</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Admissions Trend */}
          <div className="card p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg">
                <ClipboardDocumentListIcon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">Admissions Trend</h3>
                <p className="text-sm text-neutral-600">Last 7 days performance</p>
              </div>
            </div>
            <div className="space-y-4">
              {analyticsData.admissionsTrend.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-neutral-50 to-neutral-100 hover:from-primary-50 hover:to-primary-100 transition-all duration-200">
                  <span className="text-sm font-medium text-neutral-700">{day.date}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-neutral-200 rounded-full h-3 shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full shadow-sm transition-all duration-500" 
                        style={{ width: `${Math.min((day.count / Math.max(...analyticsData.admissionsTrend.map(d => d.count), 1)) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-neutral-900 w-8 text-right">{day.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contacts Trend */}
          <div className="card p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg">
                <PhoneIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">Contacts Trend</h3>
                <p className="text-sm text-neutral-600">Last 7 days inquiries</p>
              </div>
            </div>
            <div className="space-y-4">
              {analyticsData.contactsTrend.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-neutral-50 to-neutral-100 hover:from-emerald-50 hover:to-emerald-100 transition-all duration-200">
                  <span className="text-sm font-medium text-neutral-700">{day.date}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-neutral-200 rounded-full h-3 shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full shadow-sm transition-all duration-500" 
                        style={{ width: `${Math.min((day.count / Math.max(...analyticsData.contactsTrend.map(d => d.count), 1)) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-neutral-900 w-8 text-right">{day.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Gallery Categories */}
          <div className="card p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
                <PhotoIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">Gallery Categories</h3>
                <p className="text-sm text-neutral-600">Most popular content</p>
              </div>
            </div>
            <div className="space-y-4">
              {analyticsData.topCategories.slice(0, 5).map((category, index) => {
                const colors = [
                  'from-purple-500 to-purple-600',
                  'from-blue-500 to-blue-600',
                  'from-green-500 to-green-600',
                  'from-yellow-500 to-yellow-600',
                  'from-red-500 to-red-600'
                ];
                return (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-neutral-50 to-neutral-100 hover:from-purple-50 hover:to-purple-100 transition-all duration-200">
                    <span className="text-sm font-medium text-neutral-700 capitalize">{category.category}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-neutral-200 rounded-full h-3 shadow-inner">
                        <div 
                          className={`bg-gradient-to-r ${colors[index % colors.length]} h-3 rounded-full shadow-sm transition-all duration-500`}
                          style={{ width: `${Math.min((category.count / Math.max(...analyticsData.topCategories.map(c => c.count), 1)) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-neutral-900 w-8 text-right">{category.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Recent Activity</h3>
              <p className="text-sm text-neutral-600">Latest system events and updates</p>
            </div>
          </div>
          <div className="space-y-3">
            {analyticsData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-neutral-50 to-neutral-100 hover:from-blue-50 hover:to-blue-100 transition-all duration-300 border border-neutral-200 hover:border-blue-200">
                <div className={`w-3 h-3 rounded-full shadow-sm ${
                  activity.type === 'admission' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                  activity.type === 'contact' ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                  'bg-gradient-to-r from-purple-500 to-purple-600'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-neutral-900 mb-1">{activity.title}</p>
                  <p className="text-xs text-neutral-600">{activity.time.toLocaleDateString()} at {activity.time.toLocaleTimeString()}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium shadow-sm ${
                  activity.status === 'approved' || activity.status === 'active' ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300' :
                  activity.status === 'pending' || activity.status === 'new' ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border border-yellow-300' :
                  'bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-300'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
