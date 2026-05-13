import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, IdCard, Home, Users, Loader2, ArrowRight } from 'lucide-react';
import api from '../api/axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nim: '',
    nik: '',
    nama_lengkap: '',
    alamat_domisili: '',
    alamat_ktp: '',
    nama_orang_tua: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/register', formData);
      setSuccess(res.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mendaftar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden py-20">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-blue/5 rounded-full blur-3xl -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-brand-gold/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

      <div className="w-full max-w-2xl relative">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-brand-blue rounded-3xl mx-auto mb-6 flex items-center justify-center premium-shadow transform rotate-12">
            <span className="text-white text-3xl font-bold -rotate-12">M</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Daftar Akun MACE</h1>
          <p className="text-slate-500 font-medium">Lengkapi data diri anda untuk membuat akun</p>
        </div>

        <div className="bg-white rounded-[2rem] premium-shadow border border-slate-100 p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl text-sm font-medium border border-emerald-100">
                {success}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors" size={20} />
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors" size={20} />
                    <input
                      name="password"
                      type="password"
                      required
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Nama Lengkap</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors" size={20} />
                    <input
                      name="nama_lengkap"
                      type="text"
                      required
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium"
                      value={formData.nama_lengkap}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 px-1">NIM</label>
                  <div className="relative group">
                    <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors" size={20} />
                    <input
                      name="nim"
                      type="text"
                      required
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium"
                      value={formData.nim}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 px-1">NIK</label>
                  <div className="relative group">
                    <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors" size={20} />
                    <input
                      name="nik"
                      type="text"
                      required
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium"
                      value={formData.nik}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Nama Orang Tua</label>
                  <div className="relative group">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors" size={20} />
                    <input
                      name="nama_orang_tua"
                      type="text"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium"
                      value={formData.nama_orang_tua}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Alamat Domisili</label>
                  <div className="relative group">
                    <Home className="absolute left-4 top-4 text-slate-400 group-focus-within:text-brand-blue transition-colors" size={20} />
                    <textarea
                      name="alamat_domisili"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium h-[124px]"
                      value={formData.alamat_domisili}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Alamat KTP</label>
              <div className="relative group">
                <Home className="absolute left-4 top-4 text-slate-400 group-focus-within:text-brand-blue transition-colors" size={20} />
                <textarea
                  name="alamat_ktp"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium h-24"
                  value={formData.alamat_ktp}
                  onChange={handleChange}
                ></textarea>
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
                  <span>Daftar Sekarang</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-10 text-center">
            <p className="text-slate-400 text-sm font-medium">
              Sudah punya akun? <Link to="/login" className="text-brand-blue font-bold">Masuk di sini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
