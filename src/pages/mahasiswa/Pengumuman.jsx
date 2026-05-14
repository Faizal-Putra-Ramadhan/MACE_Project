import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, FileText, Upload, Loader2, Save, Printer, CreditCard } from 'lucide-react';

const Pengumuman = () => {
  const { user } = useAuth();
  const [pendaftaran, setPendaftaran] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // Form States
  const [dataDiri, setDataDiri] = useState({
    nama_lengkap: user?.mahasiswa?.nama_lengkap || '',
    nip: user?.mahasiswa?.nip || '',
    nim: user?.mahasiswa?.nim || '',
    alamat_domisili: user?.mahasiswa?.alamat_domisili || '',
    alamat_ktp: user?.mahasiswa?.alamat_ktp || '',
    nama_orang_tua: user?.mahasiswa?.nama_orang_tua || ''
  });

  const [dataPendidikan, setDataPendidikan] = useState({
    nama_pt: '',
    alamat_pt: '',
    fakultas: '',
    jurusan: '',
    prodi: '',
    semester_stase: '',
    judul_skripsi_disertasi: ''
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get('/pendaftaran');
        // Get the latest one
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

  const handleSubmitData = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put('/mahasiswa/data-diri', { dataDiri, dataPendidikan });
      alert('Data berhasil disimpan!');
      setStep(2);
    } catch (err) {
      alert('Gagal menyimpan data: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-blue" size={40} /></div>;

  if (!pendaftaran || pendaftaran.status === 'submitted') {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
         <div className="w-20 h-20 bg-slate-200 text-slate-400 rounded-full mx-auto flex items-center justify-center mb-6">
            <FileText size={32} />
         </div>
         <h3 className="text-2xl font-bold text-slate-800 mb-2">Pengumuman belum tersedia</h3>
         <p className="text-slate-500">Pendaftaran anda sedang dalam tahap verifikasi berkas. Pantau terus halaman ini.</p>
      </div>
    );
  }

  if (pendaftaran.status === 'ditolak') {
    return (
      <div className="bg-red-50 border border-red-100 rounded-[2rem] p-12 text-center">
         <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full mx-auto flex items-center justify-center mb-6">
            <FileText size={32} />
         </div>
         <h3 className="text-2xl font-bold text-red-800 mb-4">Mohon Maaf, Pendaftaran Ditolak</h3>
         <p className="text-red-700 font-medium mb-2">Alasan Penolakan:</p>
         <div className="bg-white p-4 rounded-xl border border-red-200 max-w-md mx-auto italic text-red-600">
            "{pendaftaran.alasan_penolakan || 'Berkas tidak sesuai persyaratan.'}"
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-10 flex flex-col md:flex-row items-center gap-8">
         <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex-shrink-0 flex items-center justify-center">
            <CheckCircle2 size={40} />
         </div>
         <div className="flex-1">
            <h3 className="text-3xl font-bold text-emerald-900 mb-2">Selamat! Anda Lolos Seleksi Administrasi</h3>
            <p className="text-emerald-700 leading-relaxed mb-4">
               Pendaftaran Anda telah disetujui. Silakan lengkapi data di bawah untuk proses pencairan dana.
            </p>
            <div className="flex flex-wrap gap-4">
               <div className="bg-white/50 px-4 py-2 rounded-xl border border-emerald-200">
                  <p className="text-[10px] uppercase font-bold text-emerald-600">Total Bantuan Dana</p>
                  <p className="text-xl font-bold text-slate-900">Rp {new Intl.NumberFormat('id-ID').format(pendaftaran.nominal_dana || 0)}</p>
               </div>
               <button 
                  onClick={() => window.print()}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold flex items-center space-x-2 hover:bg-emerald-700 transition-colors"
               >
                  <Printer size={18} />
                  <span>Cetak Kartu Digital</span>
               </button>
            </div>
         </div>
      </section>

      <div className="bg-white">
        <div className="flex items-center space-x-8 mb-10 border-b border-slate-100">
           <button onClick={() => setStep(1)} className={`pb-4 font-bold text-lg transition-all ${step === 1 ? 'text-brand-blue border-b-4 border-brand-blue' : 'text-slate-400'}`}>1. Data Diri</button>
           <button onClick={() => setStep(2)} className={`pb-4 font-bold text-lg transition-all ${step === 2 ? 'text-brand-blue border-b-4 border-brand-blue' : 'text-slate-400'}`}>2. Data Pendidikan</button>
           <button onClick={() => setStep(3)} className={`pb-4 font-bold text-lg transition-all ${step === 3 ? 'text-brand-blue border-b-4 border-brand-blue' : 'text-slate-400'}`}>3. Upload Dokumen</button>
        </div>

        <form onSubmit={handleSubmitData}>
          {step === 1 && (
            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-300">
               {[
                 { label: 'Nama Lengkap', key: 'nama_lengkap' },
                 { label: 'NIP (Opsional)', key: 'nip' },
                 { label: 'NIM', key: 'nim' },
                 { label: 'Nama Orang Tua', key: 'nama_orang_tua' }
               ].map(f => (
                 <div key={f.key} className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">{f.label}</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-2xl p-4 outline-none transition-all"
                      value={dataDiri[f.key]}
                      onChange={(e) => setDataDiri({...dataDiri, [f.key]: e.target.value})}
                    />
                 </div>
               ))}
               <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700">Alamat KTP</label>
                  <textarea 
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-2xl p-4 outline-none transition-all h-24"
                    value={dataDiri.alamat_ktp}
                    onChange={(e) => setDataDiri({...dataDiri, alamat_ktp: e.target.value})}
                  ></textarea>
               </div>
               <div className="flex justify-end md:col-span-2">
                  <button type="button" onClick={() => setStep(2)} className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-bold">Lanjut Ke Pendidikan</button>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-300">
               {[
                 { label: 'Nama Perguruan Tinggi', key: 'nama_pt' },
                 { label: 'Fakultas', key: 'fakultas' },
                 { label: 'Jurusan', key: 'jurusan' },
                 { label: 'Program Studi', key: 'prodi' },
                 { label: pendaftaran.program === 'B' ? 'Stase' : 'Semester', key: 'semester_stase' }
               ].map(f => (
                 <div key={f.key} className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">{f.label}</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-2xl p-4 outline-none transition-all"
                      value={dataPendidikan[f.key]}
                      onChange={(e) => setDataPendidikan({...dataPendidikan, [f.key]: e.target.value})}
                    />
                 </div>
               ))}
               <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700">Judul Skripsi / Disertasi</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-blue rounded-2xl p-4 outline-none transition-all"
                    value={dataPendidikan.judul_skripsi_disertasi}
                    onChange={(e) => setDataPendidikan({...dataPendidikan, judul_skripsi_disertasi: e.target.value})}
                  />
               </div>
               <div className="flex justify-between md:col-span-2">
                  <button type="button" onClick={() => setStep(1)} className="text-slate-500 font-bold">Kembali</button>
                  <button type="button" onClick={() => setStep(3)} className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-bold">Lanjut Ke Upload</button>
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                {[
                  { label: 'Upload Kartu Keluarga', desc: 'JPG/PDF, Maks 2MB' },
                  { label: 'Upload Pasfoto Diri', desc: 'JPG, Maks 1MB' },
                  { label: 'Upload Rekening Bank', desc: 'JPG/PDF, Maks 2MB' }
                ].map((f, i) => (
                  <div key={i} className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700">{f.label}</label>
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center">
                       <Upload className="text-slate-400 mb-2" />
                       <span className="text-sm font-bold text-slate-600">Pilih File</span>
                       <span className="text-[10px] text-slate-400 mt-1">{f.desc}</span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between md:col-span-2 pt-8">
                  <button type="button" onClick={() => setStep(2)} className="text-slate-500 font-bold">Kembali</button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="gradient-gold text-brand-blue px-12 py-4 rounded-2xl font-bold premium-shadow flex items-center space-x-2"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : (
                      <>
                        <Save size={20} />
                        <span>Simpan Semua Data</span>
                      </>
                    )}
                  </button>
                </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Pengumuman;
