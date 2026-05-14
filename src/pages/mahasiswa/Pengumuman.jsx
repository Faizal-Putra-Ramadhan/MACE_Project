import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, FileText, Loader2, XCircle } from 'lucide-react';

const Pengumuman = () => {
  const { user } = useAuth();
  const [pendaftaran, setPendaftaran] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get('/pendaftaran');
        if (res.data.length > 0) {
          setPendaftaran(res.data[res.data.length - 1]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-blue" size={40} /></div>;

  if (!pendaftaran || pendaftaran.status === 'submitted') {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
         <div className="w-20 h-20 bg-slate-200 text-slate-400 rounded-full mx-auto flex items-center justify-center mb-6">
            <FileText size={32} />
         </div>
         <h3 className="text-2xl font-bold text-slate-800 mb-2">Pengumuman belum tersedia</h3>
         <p className="text-slate-500">Pendaftaran Anda sedang dalam tahap verifikasi administrasi. Silakan cek kembali nanti.</p>
      </div>
    );
  }

  if (pendaftaran.status === 'ditolak') {
    return (
      <div className="bg-red-50 border border-red-100 rounded-[3rem] p-12 text-center">
         <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full mx-auto flex items-center justify-center mb-6">
            <XCircle size={48} />
         </div>
         <h3 className="text-3xl font-bold text-red-900 mb-4">Mohon Maaf, Pendaftaran Ditolak</h3>
         <div className="bg-white p-8 rounded-2xl border border-red-200 max-w-lg mx-auto shadow-sm">
            <p className="text-sm uppercase font-bold text-red-500 mb-2">Alasan Penolakan:</p>
            <p className="text-slate-700 italic text-lg leading-relaxed">
               "{pendaftaran.alasan_penolakan || 'Berkas tidak memenuhi persyaratan administrasi.'}"
            </p>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="bg-emerald-50 border border-emerald-100 rounded-[3rem] p-12 flex flex-col md:flex-row items-center gap-10">
         <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex-shrink-0 flex items-center justify-center shadow-inner">
            <CheckCircle2 size={56} />
         </div>
         <div className="flex-1 text-center md:text-left">
            <h3 className="text-4xl font-bold text-emerald-900 mb-3">Selamat!</h3>
            <p className="text-xl text-emerald-800 font-medium mb-6">Anda dinyatakan <span className="underline decoration-emerald-400 decoration-4 underline-offset-4">Lolos Seleksi Administrasi</span></p>
            
            <div className="inline-block bg-white/60 backdrop-blur-sm px-8 py-4 rounded-2xl border border-emerald-200/50 shadow-sm">
               <p className="text-xs uppercase font-bold text-emerald-600 mb-1">Nominal Bantuan Dana yang Disetujui</p>
               <p className="text-3xl font-black text-slate-900">
                  Rp {new Intl.NumberFormat('id-ID').format(pendaftaran.nominal_dana || 0)}
               </p>
            </div>
         </div>
      </section>

      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
         <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <div className="w-2 h-6 bg-brand-gold rounded-full mr-3"></div>
            Informasi Selanjutnya
         </h4>
         <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl">
               <p className="font-bold text-slate-900 mb-2">Pencairan Dana</p>
               <p className="text-sm text-slate-500 leading-relaxed">Proses pencairan dana akan dilakukan melalui transfer bank sesuai dengan data rekening yang Anda unggah pada laporan akhir.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl">
               <p className="font-bold text-slate-900 mb-2">Laporan Akhir</p>
               <p className="text-sm text-slate-500 leading-relaxed">Anda diwajibkan untuk mengunggah laporan akhir penggunaan dana pada menu Laporan setelah dana diterima.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Pengumuman;
