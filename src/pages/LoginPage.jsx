import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email atau password salah');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-blue/5 rounded-full blur-3xl -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-brand-gold/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-brand-blue rounded-3xl mx-auto mb-6 flex items-center justify-center premium-shadow transform rotate-12">
            <span className="text-white text-3xl font-bold -rotate-12">M</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">MACE Portal</h1>
          <p className="text-slate-500 font-medium">Sistem Bantuan Pembiayaan Pendidikan Papua</p>
        </div>

        <div className="bg-white rounded-[2rem] premium-shadow border border-slate-100 p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors" size={20} />
                <input
                  type="email"
                  required
                  placeholder="admin@mace.go.id"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors" size={20} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full gradient-blue hover:opacity-90 text-white rounded-2xl py-4 font-bold premium-shadow flex items-center justify-center space-x-2 group transition-all"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <span>Masuk ke Akun</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-10 text-center space-y-4">
            <p className="text-slate-500 text-sm font-medium">
              Belum punya akun? <Link to="/register" className="text-brand-blue font-bold">Daftar sekarang</Link>
            </p>
            <p className="text-slate-400 text-xs font-medium">
              Butuh bantuan akses? Hubungi <span className="text-brand-blue">Admin MACE</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
