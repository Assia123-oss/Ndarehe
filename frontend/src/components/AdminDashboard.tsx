import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Hotel, 
  Car, 
  MapPin, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  LogOut as Logout
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UsersManagement from "./admin/UsersManagement";
import AccommodationsManagement from "./admin/AccommodationsManagement";
import BookingsManagement from "./admin/BookingsManagement";
import TransportationManagement from "./admin/TransportationManagement";
import ToursManagement from "./admin/ToursManagement";
import ReportsPanel from "./admin/ReportsPanel";
import SettingsPanel from "./admin/SettingsPanel";
import AnalyticsPanel from "./admin/AnalyticsPanel";
import NotificationsPanel from "./admin/NotificationsPanel";
import HelpPanel from "./admin/HelpPanel";
import { AddNewModal, ExportReportModal } from "./admin/DashboardModals";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAccommodations: 0,
    totalTours: 0,
    totalTransportation: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    pendingTripPlans: 0,
    unverifiedAccommodations: 0,
    unverifiedTransportation: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportOpen, setExportOpen] = useState(false);
  const [addNewOpen, setAddNewOpen] = useState(false);

  useEffect(() => {
    // Fetch dashboard stats and recent activity from backend
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.data.success) {
          setStats(res.data.data.stats || {});
          // Recent activity from recent bookings
          const bookings = (res.data.data.recentBookings || []).map((b: any) => ({
            id: b.id,
            type: b.status === 'CONFIRMED' ? 'booking_confirmed' : 'booking_created',
            message: `${b.status === 'CONFIRMED' ? 'Booking confirmed' : 'New booking'} • ${(b.accommodation?.name || b.transportation?.name || b.tour?.name || 'Service')}`,
            timestamp: new Date(b.createdAt).toLocaleString(),
            priority: b.status === 'CONFIRMED' ? 'medium' : 'low'
          }));
          setRecentActivity(bookings);
        }
      } catch (err) {
        // fallback to empty data
        setStats({
          totalUsers: 0,
          totalAccommodations: 0,
          totalTours: 0,
          totalTransportation: 0,
          totalBookings: 0,
          totalRevenue: 0,
          pendingBookings: 0,
          pendingTripPlans: 0,
          unverifiedAccommodations: 0,
          unverifiedTransportation: 0,
        });
        setRecentActivity([]);
      }
      setLoading(false);
    };
    fetchDashboard();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return <Users className="h-4 w-4 text-green-600" />;
      case 'booking_confirmed':
        return <Calendar className="h-4 w-4 text-green-600" />;
      case 'payment_received':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-orange-200 bg-orange-50';
      case 'low':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans">
      {/* Left Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-green-600 to-green-500 text-white shadow-lg flex flex-col">
        <div className="p-6 flex items-center space-x-3 group">
          <div className="relative">
            <img
              src="/favicon.png"
              alt="NDAREHE"
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-110"
              style={{ border: 'none', boxShadow: 'none' }}
            />
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
        <nav className="mt-8 flex-1">
          <div className="px-4 space-y-1">
            {[
              { tab: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { tab: 'bookings', label: 'Bookings', icon: Calendar },
              { tab: 'users', label: 'Users', icon: Users },
              { tab: 'accommodations', label: 'Accommodations', icon: Hotel },
              { tab: 'transportation', label: 'Transportation', icon: Car },
              { tab: 'tours', label: 'Tours', icon: MapPin },
              { tab: 'reports', label: 'Reports', icon: BarChart3 },
              { tab: 'settings', label: 'Settings', icon: BarChart3 },
              { tab: 'analytics', label: 'Analytics', icon: TrendingUp },
              { tab: 'notifications', label: 'Notifications', icon: AlertTriangle },
              { tab: 'help', label: 'Help', icon: Eye },
            ].map(({ tab, label, icon: Icon }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center px-4 py-2 text-base font-medium rounded-lg transition-colors duration-150 ${
                  activeTab === tab
                    ? 'bg-white text-green-700 shadow font-semibold'
                    : 'text-white hover:bg-green-700/80'
                }`}
              >
                <span
                  className={`mr-3 h-5 w-5 flex items-center justify-center rounded-full transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-green-100 text-green-700'
                      : 'bg-green-700/30 text-white group-hover:bg-green-600/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {label}
              </button>
            ))}
          </div>
        </nav>
        <div className="p-4 flex flex-col items-center space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg bg-white text-green-700 hover:bg-green-100 transition-colors duration-150 shadow"
          >
            <Logout className="h-5 w-5 mr-2" />
            Logout
          </button>
          <span className="text-xs text-green-100 opacity-70">Admin Panel</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-50 min-h-screen">
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-extrabold text-green-700 mb-1">Admin Dashboard</h1>
                <p className="text-gray-500 text-lg">Welcome back, <span className="font-semibold">{user?.firstName}</span>!</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50" onClick={() => setExportOpen(true)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => setAddNewOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="bg-white rounded-xl shadow hover:shadow-lg transition">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-semibold text-green-700">Total Users</CardTitle>
                  <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-800">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-gray-400 mt-1">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-white rounded-xl shadow hover:shadow-lg transition">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-semibold text-green-700">Total Bookings</CardTitle>
                  <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-full">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-800">{stats.totalBookings.toLocaleString()}</div>
                  <p className="text-xs text-gray-400 mt-1">+12.5% from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-white rounded-xl shadow hover:shadow-lg transition">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-semibold text-green-700">Total Revenue</CardTitle>
                  <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-800">${stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-gray-400 mt-1">+8.2% from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-white rounded-xl shadow hover:shadow-lg transition">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-semibold text-yellow-700">Pending Bookings</CardTitle>
                  <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-800">{stats.pendingBookings}</div>
                  <p className="text-xs text-yellow-600 mt-1">Requires attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white rounded-xl shadow hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-green-700">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center text-gray-400">Loading...</div>
                  ) : recentActivity.length === 0 ? (
                    <div className="text-center text-gray-400">No recent activity.</div>
                  ) : (
                    recentActivity.map((activity: any) => (
                      <div key={activity.id} className={`flex items-center space-x-4 p-4 rounded-lg border ${getAlertColor(activity.priority)}`}>
                        {getAlertIcon(activity.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{activity.message}</p>
                          <p className="text-xs text-gray-400">{activity.timestamp}</p>
                        </div>
                        <Badge variant="outline" className={`text-xs capitalize ${activity.priority === 'high' ? 'border-red-400 text-red-600' : activity.priority === 'medium' ? 'border-orange-400 text-orange-600' : 'border-yellow-400 text-yellow-600'}`}>
                          {activity.priority}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Other Tabs */}
        {activeTab === 'bookings' && <BookingsManagement />}
        {activeTab === 'users' && <UsersManagement />}
        {activeTab === 'accommodations' && <AccommodationsManagement />}
        {activeTab === 'transportation' && <TransportationManagement />}
        {activeTab === 'tours' && <ToursManagement />}
        {activeTab === 'reports' && <ReportsPanel />}
        {activeTab === 'settings' && <SettingsPanel />}
        {activeTab === 'analytics' && <AnalyticsPanel />}
        {activeTab === 'notifications' && <NotificationsPanel />}
        {activeTab === 'help' && <HelpPanel />}
      </main>

      {/* Global modals */}
      <ExportReportModal open={exportOpen} onOpenChange={setExportOpen} />
      <AddNewModal open={addNewOpen} onOpenChange={setAddNewOpen} />
    </div>
  );
};

export default AdminDashboard;
