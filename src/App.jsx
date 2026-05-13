import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentLayout from './components/layout/StudentLayout';
import AdminLayout from './components/layout/AdminLayout';

// Student Pages
import Beranda from './pages/mahasiswa/Beranda';
import PendaftaranForm from './pages/mahasiswa/PendaftaranForm';
import Pengumuman from './pages/mahasiswa/Pengumuman';
import LaporanCard from './pages/mahasiswa/LaporanCard';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManagePendaftaran from './pages/admin/ManagePendaftaran';
import SeleksiBerkas from './pages/admin/SeleksiBerkas';
import ManagePenerima from './pages/admin/ManagePenerima';
import LaporanMahasiswa from './pages/admin/LaporanMahasiswa';
import ManageUsers from './pages/admin/ManageUsers';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/'} />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Main Layout - Beranda is Public */}
          <Route element={<StudentLayout />}>
            <Route path="/" element={<Beranda />} />
            
            {/* Protected Student Routes */}
            <Route path="daftar/:program" element={<ProtectedRoute role="mahasiswa"><PendaftaranForm /></ProtectedRoute>} />
            <Route path="pengumuman" element={<ProtectedRoute role="mahasiswa"><Pengumuman /></ProtectedRoute>} />
            <Route path="laporan" element={<ProtectedRoute role="mahasiswa"><LaporanCard /></ProtectedRoute>} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="pendaftaran" element={<ManagePendaftaran />} />
            <Route path="seleksi" element={<SeleksiBerkas />} />
            <Route path="penerima" element={<ManagePenerima />} />
            <Route path="laporan" element={<LaporanMahasiswa />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
