import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Eye, Check, X, FileText, ExternalLink, Loader2 } from 'lucide-react';

const SeleksiBerkas = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'view', 'reject', 'approve'
  const [nominalDana, setNominalDana] = useState(0);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/pendaftaran');
        setList(res.data.filter(p => p.status === 'submitted'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshTrigger]);

  const handleAction = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/admin/pendaftaran/${id}/status?token=${token}`, { 
        status, 
        alasan_penolakan: status === 'ditolak' ? rejectionReason : null,
        nominal_dana: status === 'lolos_berkas' ? nominalDana : null
      });
      alert(`Berhasil: Status diupdate ke ${status}`);
      setShowModal(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      alert('Gagal update: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2rem] premium-shadow border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-5 font-bold text-slate-700 text-sm">NAMA MAHASISWA</th>
              <th className="px-8 py-5 font-bold text-slate-700 text-sm">NIM</th>
              <th className="px-8 py-5 font-bold text-slate-700 text-sm">PROGRAM</th>
              <th className="px-8 py-5 font-bold text-slate-700 text-sm text-center">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
               <tr><td colSpan="4" className="text-center py-20"><Loader2 className="animate-spin inline mr-2" /> Loading...</td></tr>
            ) : list.length === 0 ? (
               <tr><td colSpan="4" className="text-center py-20 text-slate-400">Tidak ada pendaftaran baru yang perlu diseleksi.</td></tr>
            ) : list.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-5">
                   <p className="font-bold text-slate-900">{item.mahasiswa?.nama_lengkap}</p>
                   <p className="text-xs text-slate-500">{new Date(item.created_at).toLocaleDateString()}</p>
                </td>
                <td className="px-8 py-5 font-medium text-slate-600">{item.mahasiswa?.nim}</td>
                <td className="px-8 py-5">
                   <span className="bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-xs font-bold">Program {item.program}</span>
                </td>
                <td className="px-8 py-5">
                   <div className="flex items-center justify-center space-x-3">
                      <button 
                        onClick={() => { setSelected(item); setModalType('view'); setShowModal(true); }}
                        className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-brand-blue hover:text-white transition-all"
                      >
                         <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => { setSelected(item); setModalType('approve'); setShowModal(true); setNominalDana(15000000); }}
                        className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
                      >
                         <Check size={18} />
                      </button>
                      <button 
                        onClick={() => { setSelected(item); setModalType('reject'); setShowModal(true); }}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                      >
                         <X size={18} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal View / Reject */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
           <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="text-2xl font-bold text-slate-900">{modalType === 'view' ? 'Detail Berkas Pendaftaran' : 'Alasan Penolakan'}</h3>
                 <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
              </div>
              
              <div className="p-8 overflow-y-auto max-h-[70vh]">
                 {modalType === 'view' ? (
                    <div className="space-y-6">
                       <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl">
                          <div>
                             <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Nama Mahasiswa</p>
                             <p className="font-bold text-slate-900">{selected?.mahasiswa?.nama_lengkap}</p>
                          </div>
                          <div>
                             <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">NIM / NIK</p>
                             <p className="font-bold text-slate-900">{selected?.mahasiswa?.nim} / {selected?.mahasiswa?.nik}</p>
                          </div>
                       </div>
                       
                       <div className="space-y-4">
                          <p className="font-bold text-slate-700 mb-4">Dokumen Terupload:</p>
                          {selected?.dokumen_pendaftarans?.map((doc, idx) => (
                             <div key={idx} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50">
                                <div className="flex items-center space-x-3">
                                   <div className="bg-brand-blue/10 p-2 rounded-lg text-brand-blue"><FileText size={18} /></div>
                                   <span className="text-sm font-bold text-slate-700 capitalize">{doc.jenis_dokumen.replace('_', ' ')}</span>
                                </div>
                                <a 
                                  href={doc.file_path} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-brand-blue text-sm font-bold flex items-center hover:underline"
                                >
                                   Lihat <ExternalLink size={14} className="ml-1" />
                                </a>
                             </div>
                          ))}
                       </div>
                     </div>
                  ) : modalType === 'approve' ? (
                     <div className="space-y-6">
                        <p className="text-slate-600">Setujui berkas <strong>{selected?.mahasiswa?.nama_lengkap}</strong> dan tentukan nominal bantuan dana:</p>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-500 uppercase">Nominal Dana (IDR)</label>
                           <input 
                              type="number" 
                              className="w-full bg-slate-50 border-2 border-slate-100 focus:border-emerald-500 rounded-2xl p-4 outline-none text-2xl font-bold text-slate-900"
                              value={nominalDana}
                              onChange={(e) => setNominalDana(e.target.value)}
                           />
                        </div>
                        <button 
                         onClick={() => handleAction(selected.id, 'lolos_berkas')}
                         className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200"
                        >
                           Konfirmasi Persetujuan
                        </button>
                     </div>
                  ) : (
                    <div className="space-y-6">
                       <p className="text-slate-600">Berikan alasan penolakan berkas kepada mahasiswa <strong>{selected?.mahasiswa?.nama_lengkap}</strong>:</p>
                       <textarea 
                         className="w-full bg-slate-50 border-2 border-slate-100 focus:border-red-500 rounded-2xl p-4 outline-none h-32"
                         placeholder="Contoh: KTP tidak jelas / Surat aktif kuliah sudah kadaluarsa..."
                         value={rejectionReason}
                         onChange={(e) => setRejectionReason(e.target.value)}
                       ></textarea>
                       <button 
                        onClick={() => handleAction(selected.id, 'ditolak')}
                        className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-200"
                       >
                          Konfirmasi Penolakan
                       </button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SeleksiBerkas;
