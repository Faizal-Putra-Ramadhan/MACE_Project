import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Users, FileText, CheckCircle, Clock, BarChart, PieChart } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPendaftar: 0,
    lolosBerkas: 0,
    laporanLengkap: 0,
    perProgram: { A: 12, B: 8, C: 5, D: 3, E: 2 }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/statistik');
        setStats(prev => ({ ...prev, ...res.data }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Pendaftar', value: stats.totalPendaftar, icon: Users, color: 'bg-blue-500' },
    { label: 'Lolos Seleksi Berkas', value: stats.lolosBerkas, icon: CheckCircle, color: 'bg-emerald-500' },
    { label: 'Laporan Lengkap', value: stats.laporanLengkap, icon: FileText, color: 'bg-amber-500' },
    { label: 'Menunggu Verifikasi', value: stats.totalPendaftar - stats.lolosBerkas, icon: Clock, color: 'bg-slate-400' },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl premium-shadow border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{card.label}</p>
              <h4 className="text-3xl font-bold text-slate-900">{card.value}</h4>
            </div>
            <div className={`${card.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-${card.color.split('-')[1]}-200`}>
               <card.icon size={28} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
         <div className="bg-white p-10 rounded-[2.5rem] premium-shadow border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center">
               <BarChart className="mr-2 text-brand-blue" />
               Distribusi Program Bantuan
            </h3>
            <div className="space-y-6">
               {Object.entries(stats.perProgram).map(([prog, count]) => (
                 <div key={prog} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                       <span className="text-slate-700">Program {prog}</span>
                       <span className="text-brand-blue">{count} Mahasiswa</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                       <div 
                        className="h-full gradient-blue rounded-full transition-all duration-1000" 
                        style={{ width: `${(count / 30) * 100}%` }}
                       ></div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white p-10 rounded-[2.5rem] premium-shadow border border-slate-100 flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center self-start">
               <PieChart className="mr-2 text-brand-blue" />
               Status Kelengkapan
            </h3>
            <div className="relative w-64 h-64 rounded-full border-[20px] border-slate-100 flex items-center justify-center">
               <div className="text-center">
                  <p className="text-4xl font-bold text-brand-blue">{Math.round((stats.lolosBerkas / stats.totalPendaftar || 0) * 100)}%</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Lolos Berkas</p>
               </div>
            </div>
            <div className="mt-8 flex gap-6">
               <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
                  <span className="text-xs font-bold text-slate-500">Lolos Berkas</span>
               </div>
               <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <span className="text-xs font-bold text-slate-500">Draft/Submitted</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
