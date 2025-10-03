import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

// Import components
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import AdminLayout from './components/admin/AdminLayout';
import StudentLayout from './components/student/StudentLayout';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import AdmissionForm from './pages/AdmissionForm';
import AdmissionStatus from './pages/AdmissionStatus';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import OTPVerification from './pages/OTPVerification';
import ResetPassword from './pages/ResetPassword';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentIdCard from './pages/student/IdCard';
import Settings from './pages/student/Settings';
import AccountSettings from './pages/student/AccountSettings';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminAdmissions from './pages/admin/Admissions';
import AdminStudents from './pages/admin/Students';
import AdminContacts from './pages/admin/Contacts';
import AdminNotifications from './pages/admin/Notifications';
import AdminSettings from './pages/admin/Settings';
import AdminCourses from './pages/admin/Courses';
import AdminLibrary from './pages/admin/Library';
import AdminExams from './pages/admin/Exams';
import AdminHelp from './pages/admin/Help';
import AdminGallery from './pages/admin/Gallery';
import Analytics from './pages/admin/Analytics';

// Protected Route Components
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    // Redirect authenticated users to their dashboard
    const redirectPath = user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Main App Layout
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pb-8">
        {children}
      </main>
    </div>
  );
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<AppLayout><Home /></AppLayout>} />
      <Route path="/about" element={<AppLayout><About /></AppLayout>} />
      <Route path="/gallery" element={<AppLayout><Gallery /></AppLayout>} />
      <Route path="/contact" element={<AppLayout><Contact /></AppLayout>} />
      <Route path="/admission" element={<AppLayout><AdmissionForm /></AppLayout>} />
      <Route path="/admission-status" element={<AppLayout><AdmissionStatus /></AppLayout>} />
      
      {/* Authentication Routes (only for non-authenticated users) */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/forgot-password" 
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } 
      />
      <Route 
        path="/verify-otp" 
        element={
          <PublicRoute>
            <OTPVerification />
          </PublicRoute>
        } 
      />
      <Route 
        path="/reset-password" 
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } 
      />

      {/* Student Routes - Using StudentLayout */}
      <Route 
        path="/student/*" 
        element={
          <ProtectedRoute requiredRole="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="id-card" element={<StudentIdCard />} />
        <Route path="settings" element={<Settings />} />
        
        {/* Additional student routes for sidebar navigation */}
        <Route 
          path="courses" 
          element={
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Courses</h1>
              <p className="text-gray-600">Course management features coming soon!</p>
            </div>
          } 
        />
        <Route 
          path="library" 
          element={
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Library</h1>
              <p className="text-gray-600">Library management features coming soon!</p>
            </div>
          } 
        />
        <Route 
          path="exams" 
          element={
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Exams</h1>
              <p className="text-gray-600">Exam management features coming soon!</p>
            </div>
          } 
        />
        <Route 
          path="notifications" 
          element={
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Notifications</h1>
              <p className="text-gray-600">Notification center coming soon!</p>
            </div>
          } 
        />
        <Route 
          path="help" 
          element={
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Help & Support</h1>
              <p className="text-gray-600">Support features coming soon!</p>
            </div>
          } 
        />
        
        {/* Default redirect to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>



      {/* Admin Routes - Using AdminLayout */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="admissions" element={<AdminAdmissions />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="contacts" element={<AdminContacts />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="library" element={<AdminLibrary />} />
        <Route path="exams" element={<AdminExams />} />
        <Route path="help" element={<AdminHelp />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="analytics" element={<Analytics />} />
        
        {/* Additional admin routes */}
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="settings" element={<AdminSettings />} />
        
        {/* Default redirect to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Catch all route - redirect to appropriate dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <AppRoutes />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
