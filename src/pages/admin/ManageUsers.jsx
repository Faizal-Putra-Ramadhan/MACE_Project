import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { UserPlus, UserCircle, Shield, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
         <h3 className="text-2xl font-bold text-slate-800">Manajemen Pengguna</h3>
         <button className="gradient-blue text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2">
            <UserPlus size={20} />
            <span>Tambah User</span>
         </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
         {loading ? (
           <div className="col-span-full py-20 text-center"><Loader2 className="animate-spin inline" /></div>
         ) : users.map(u => (
           <div key={u.id} className="bg-white p-8 rounded-3xl premium-shadow border border-slate-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-brand-blue mb-4">
                 <UserCircle size={40} />
              </div>
              <h4 className="font-bold text-slate-900">{u.mahasiswa?.nama_lengkap || 'Administrator'}</h4>
              <p className="text-sm text-slate-500 mb-4">{u.email}</p>
              
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                 <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    <Shield size={12} className={u.role === 'admin' ? 'text-amber-500' : 'text-brand-blue'} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{u.role}</span>
                 </div>
                 {u.role === 'mahasiswa' && (
                   <div className={cn(
                     "flex items-center space-x-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest",
                     u.is_approved ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-amber-50 border-amber-100 text-amber-600"
                   )}>
                     <span>{u.is_approved ? 'Disetujui' : 'Menunggu'}</span>
                   </div>
                 )}
              </div>

              {u.role === 'mahasiswa' && !u.is_approved && (
                <button 
                  onClick={async () => {
                    if (confirm(`Setujui akun ${u.mahasiswa?.nama_lengkap || u.email}?`)) {
                      try {
                        await api.put('/admin/users/approve', { id: u.id });
                        window.location.reload();
                      } catch {
                        alert('Gagal menyetujui user');
                      }
                    }
                  }}
                  className="w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  Setujui Akun
                </button>
              )}
           </div>
         ))}
      </div>
    </div>
  );
};

export default ManageUsers;
