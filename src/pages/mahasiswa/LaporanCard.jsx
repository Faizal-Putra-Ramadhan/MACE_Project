import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FileUp, Download, Printer, Loader2, CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';

const LaporanCard = () => {
  const { user } = useAuth();
  const [pendaftaran, setPendaftaran] = useState(null);
  const [laporan, setLaporan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState({});
  const cardRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resP = await api.get('/pendaftaran');
        if (resP.data.length > 0) {
          const latest = resP.data[resP.data.length - 1];
          setPendaftaran(latest);
          
          // Fetch report info
          const resL = await api.get('/laporan/saya');
          const myL = resL.data.find(l => l.pendaftaran_id === latest.id);
          setLaporan(myL);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    setFiles(prev => ({ ...prev, [name]: uploadedFiles[0] }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      const { uploadDokumen } = await import('../../lib/supabase');
      const payload = { pendaftaran_id: pendaftaran.id };

      if (files.surat_laporan) payload.surat_laporan_url = await uploadDokumen(files.surat_laporan, 'laporan');
      if (files.fc_rekening) payload.fc_rekening_url = await uploadDokumen(files.fc_rekening, 'rekening');
      if (files.bukti_pengeluaran) payload.bukti_pengeluaran_url = await uploadDokumen(files.bukti_pengeluaran, 'laporan');

      const res = await api.post('/laporan', payload);
      setLaporan(res.data.data);
      alert('Laporan berhasil diupload!');
    } catch (err) {
      alert('Gagal upload: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateCard = async () => {
    try {
      const res = await api.post('/kartu/generate', { pendaftaran_id: pendaftaran.id });
      setPendaftaran(prev => ({ ...prev, kode_kartu: res.data.kode, status: 'selesai' }));
    } catch (err) {
      alert('Gagal generate kartu: ' + err.message);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => cardRef.current,
  });

  const handleDownloadImage = async () => {
    const element = cardRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = data;
    link.download = `MACE_CARD_${pendaftaran?.kode_kartu}.png`;
    link.click();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-blue" size={40} /></div>;

  if (!pendaftaran || pendaftaran.status === 'submitted' || pendaftaran.status === 'draft') {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
         <h3 className="text-2xl font-bold text-slate-800">Halaman Belum Tersedia</h3>
         <p className="text-slate-500 mt-2">Halaman ini akan aktif setelah pendaftaran anda dinyatakan Lolos Berkas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section>
        <h3 className="text-2xl font-bold mb-8 flex items-center">
           <FileUp className="mr-3 text-brand-blue" />
           Pelaporan Dana Bantuan
        </h3>
        <div className="bg-slate-50 rounded-[2rem] p-10 border border-slate-100">
           <form onSubmit={handleUpload} className="grid md:grid-cols-3 gap-8">
              {[
                { label: 'Surat Laporan Pemanfaatan', name: 'surat_laporan', exists: laporan?.surat_laporan_path },
                { label: 'Fotokopi Rekening (Mutasi)', name: 'fc_rekening', exists: laporan?.fc_rekening_path },
                { label: 'Bukti Pengeluaran / Kwitansi', name: 'bukti_pengeluaran', exists: laporan?.bukti_pengeluaran_path }
              ].map(f => (
                <div key={f.name} className="space-y-3">
                   <label className="text-sm font-bold text-slate-700">{f.label}</label>
                   <div className="relative group">
                      <input type="file" name={f.name} onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      <div className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center transition-all ${f.exists ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-200 group-hover:border-brand-blue'}`}>
                         {f.exists ? <CheckCircle2 size={24} /> : <FileUp size={24} className="text-slate-400 group-hover:text-brand-blue" />}
                         <span className="text-xs font-bold mt-2 truncate max-w-full">{files[f.name]?.name || (f.exists ? 'Terverifikasi' : 'Pilih Berkas')}</span>
                      </div>
                   </div>
                </div>
              ))}
              <div className="md:col-span-3 flex justify-center pt-4">
                 <button 
                  disabled={isUploading || (!files.surat_laporan && !files.fc_rekening && !files.bukti_pengeluaran)} 
                  className="gradient-blue text-white px-10 py-4 rounded-2xl font-bold premium-shadow flex items-center space-x-2 disabled:opacity-50"
                 >
                    {isUploading ? <Loader2 className="animate-spin" /> : <><ShieldCheck size={20} /> <span>Submit Laporan</span></>}
                 </button>
              </div>
           </form>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-bold mb-8 flex items-center">
           <CreditCard className="mr-3 text-brand-blue" />
           Kartu Digital Mahasiswa
        </h3>

        {!laporan?.is_complete ? (
           <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-10 text-center">
              <p className="text-amber-800 font-medium">Lengkapi semua dokumen laporan di atas untuk mengaktifkan Kartu Digital anda.</p>
           </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 items-center">
             {/* Card Preview */}
             <div ref={cardRef} className="w-[450px] h-[280px] bg-brand-blue rounded-3xl p-8 relative text-white overflow-hidden premium-shadow">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold opacity-10 rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
                
                <div className="flex justify-between items-start mb-10 relative z-10">
                   <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center justify-center font-bold text-brand-blue">M</div>
                      <span className="font-bold tracking-tight">MACE PORTAL</span>
                   </div>
                   <div className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">PAPUA PROVINCE</div>
                </div>

                <div className="relative z-10">
                   <h4 className="text-2xl font-bold mb-1">{user?.mahasiswa?.nama_lengkap}</h4>
                   <p className="text-white/60 text-sm font-medium mb-6">NIM: {user?.mahasiswa?.nim}</p>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <p className="text-[10px] uppercase text-brand-gold font-bold">Program</p>
                         <p className="text-xs font-bold">Program {pendaftaran?.program}</p>
                      </div>
                      <div>
                         <p className="text-[10px] uppercase text-brand-gold font-bold">Tahun</p>
                         <p className="text-xs font-bold">{new Date(pendaftaran?.created_at).getFullYear()}</p>
                      </div>
                   </div>
                </div>

                <div className="absolute bottom-8 right-8 text-right z-10">
                   <p className="text-[8px] text-white/40 uppercase font-bold mb-1">Unique Digital Code</p>
                   <p className="font-mono text-brand-gold font-bold tracking-wider">{pendaftaran?.kode_kartu || 'PENDING'}</p>
                </div>
             </div>

             {/* Actions */}
             <div className="flex-1 space-y-6">
                {!pendaftaran?.kode_kartu ? (
                   <button 
                    onClick={handleGenerateCard}
                    className="w-full gradient-gold text-brand-blue py-5 rounded-2xl font-bold text-lg premium-shadow hover:scale-[1.02] transition-transform"
                   >
                     Aktivasi Kartu Digital
                   </button>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handlePrint}
                      className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-3xl hover:bg-slate-50 transition-colors group"
                    >
                       <Printer className="mb-3 text-brand-blue group-hover:scale-110 transition-transform" size={32} />
                       <span className="font-bold text-slate-800">Cetak Kartu</span>
                    </button>
                    <button 
                      onClick={handleDownloadImage}
                      className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-3xl hover:bg-slate-50 transition-colors group"
                    >
                       <Download className="mb-3 text-emerald-600 group-hover:scale-110 transition-transform" size={32} />
                       <span className="font-bold text-slate-800">Unduh Gambar</span>
                    </button>
                  </div>
                )}
                <div className="bg-slate-100 p-6 rounded-2xl">
                   <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      <span className="text-brand-blue font-bold">Catatan:</span> Kode kartu digital di atas dapat digunakan untuk mendaftar <strong>Program E (Bantuan Lanjutan)</strong> di tahun akademik berikutnya.
                   </p>
                </div>
             </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default LaporanCard;
