import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Check, X, FileText, Loader2, AlertCircle } from 'lucide-react';

const LaporanMahasiswa = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/admin/laporan');
        setList(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-[2rem] premium-shadow border border-slate-100 overflow-hidden">
       <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-5 font-bold text-slate-700 text-sm">NAMA MAHASISWA</th>
              <th className="px-8 py-5 font-bold text-slate-700 text-sm text-center">STATUS DOKUMEN</th>
              <th className="px-8 py-5 font-bold text-slate-700 text-sm text-center">VERIFIKASI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
               <tr><td colSpan="3" className="text-center py-20"><Loader2 className="animate-spin inline mr-2" /> Loading...</td></tr>
            ) : list.length === 0 ? (
               <tr><td colSpan="3" className="text-center py-20 text-slate-400">Belum ada laporan yang diunggah.</td></tr>
            ) : list.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-5 font-bold text-slate-900">{item.pendaftaran?.mahasiswa?.nama_lengkap}</td>
                <td className="px-8 py-5 text-center">
                   <div className="flex justify-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${item.surat_laporan_path ? 'bg-emerald-500' : 'bg-slate-200'}`} title="Surat Laporan"></div>
                      <div className={`w-3 h-3 rounded-full ${item.fc_rekening_path ? 'bg-emerald-500' : 'bg-slate-200'}`} title="FC Rekening"></div>
                      <div className={`w-3 h-3 rounded-full ${item.bukti_pengeluaran_path ? 'bg-emerald-500' : 'bg-slate-200'}`} title="Bukti Pengeluaran"></div>
                   </div>
                </td>
                <td className="px-8 py-5 text-center">
                   {item.is_complete ? (
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Lengkap</span>
                   ) : (
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Belum Lengkap</span>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
       </table>
    </div>
  );
};

export default LaporanMahasiswa;
