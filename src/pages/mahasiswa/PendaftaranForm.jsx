import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, AlertCircle, Loader2, Upload, Search, ArrowLeft, ArrowRight } from 'lucide-react';

const PendaftaranForm = () => {
  const { program } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [nim, setNim] = useState('');
  const [nik, setNik] = useState('');
  const [isNimValid, setIsNimValid] = useState(null);
  const [isNikValid, setIsNikValid] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationMsg, setValidationMsg] = useState({ nim: '', nik: '' });
  
  const [files, setFiles] = useState({});
  const [kodeKartu, setKodeKartu] = useState(''); // For Program E
  const [isKodeValid, setIsKodeValid] = useState(null);

  const programs = {
    'A': 'Studi Akhir',
    'B': 'Koas',
    'C': 'Spesialis',
    'D': 'S3 Dosen',
    'E': 'Bantuan Lanjutan'
  };

  const handleValidateNim = async () => {
    if (!nim) return;
    setIsValidating(true);
    try {
      const res = await api.get(`/validate/nim/${nim}`);
      setIsNimValid(true);
      setValidationMsg(prev => ({ ...prev, nim: `Data ditemukan: ${res.data.data.nama} (${res.data.data.pt})` }));
    } catch (err) {
      setIsNimValid(false);
      setValidationMsg(prev => ({ ...prev, nim: 'NIM tidak terdaftar di PDDikti' }));
    } finally {
      setIsValidating(false);
    }
  };

  const handleValidateNik = async () => {
    if (!nik) return;
    setIsValidating(true);
    try {
      const res = await api.get(`/validate/nik/${nik}`);
      setIsNikValid(true);
      setValidationMsg(prev => ({ ...prev, nik: `Data valid: ${res.data.data.wilayah}` }));
    } catch (err) {
      setIsNikValid(false);
      setValidationMsg(prev => ({ ...prev, nik: 'NIK tidak valid atau bukan OAP Papua' }));
    } finally {
      setIsValidating(false);
    }
  };

  const handleValidateKode = async () => {
    if (!kodeKartu) return;
    setIsValidating(true);
    try {
      const res = await api.get(`/pendaftaran/cek-kode/${kodeKartu}`);
      setIsKodeValid(true);
    } catch (err) {
      setIsKodeValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    setFiles(prev => ({ ...prev, [name]: uploadedFiles[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsValidating(true);
    
    try {
      const { uploadDokumen } = await import('../../lib/supabase');
      const uploadedDocs = [];

      // Upload each file to Supabase
      for (const key of Object.keys(files)) {
        if (files[key]) {
          const url = await uploadDokumen(files[key], 'dokumen-pendaftaran');
          uploadedDocs.push({ jenis: key, url });
        }
      }

      await api.post('/pendaftaran', {
        program,
        documents: uploadedDocs
      });

      setStep(3); // Confirmation step
    } catch (err) {
      alert('Gagal submit pendaftaran: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Pendaftaran Program {program} — {programs[program]}</h2>
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2"></div>
          <div className={`absolute top-1/2 left-0 h-1 bg-brand-blue -translate-y-1/2 transition-all duration-500`} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
          
          {[1, 2, 3].map((s) => (
            <div key={s} className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold border-4 transition-all duration-300 ${step >= s ? 'bg-brand-blue border-brand-blue text-white' : 'bg-white border-slate-100 text-slate-400'}`}>
              {step > s ? <CheckCircle2 size={24} /> : s}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-sm font-bold text-slate-500">
           <span>Validasi Data</span>
           <span>Unggah Berkas</span>
           <span>Selesai</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-brand-blue/5 p-6 rounded-2xl border border-brand-blue/10">
               <p className="text-brand-blue font-medium flex items-center">
                 <AlertCircle size={18} className="mr-2" />
                 Pastikan data NIM dan NIK anda sesuai dengan PDDikti dan DUKCAPIL.
               </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Nomor Induk Mahasiswa (NIM)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className={`w-full bg-slate-50 border-2 rounded-2xl py-4 px-4 pr-12 outline-none transition-all ${isNimValid === true ? 'border-emerald-500' : isNimValid === false ? 'border-red-500' : 'border-transparent focus:border-brand-blue'}`}
                    placeholder="Contoh: 2021001"
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                  />
                  <button onClick={handleValidateNim} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-brand-blue hover:bg-brand-blue/10 rounded-xl transition-colors">
                    <Search size={20} />
                  </button>
                </div>
                {validationMsg.nim && (
                  <p className={`text-sm font-medium ${isNimValid ? 'text-emerald-600' : 'text-red-600'}`}>{validationMsg.nim}</p>
                )}
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">Nomor Induk Kependudukan (NIK)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className={`w-full bg-slate-50 border-2 rounded-2xl py-4 px-4 pr-12 outline-none transition-all ${isNikValid === true ? 'border-emerald-500' : isNikValid === false ? 'border-red-500' : 'border-transparent focus:border-brand-blue'}`}
                    placeholder="16 digit NIK"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                  />
                  <button onClick={handleValidateNik} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-brand-blue hover:bg-brand-blue/10 rounded-xl transition-colors">
                    <Search size={20} />
                  </button>
                </div>
                {validationMsg.nik && (
                  <p className={`text-sm font-medium ${isNikValid ? 'text-emerald-600' : 'text-red-600'}`}>{validationMsg.nik}</p>
                )}
              </div>
            </div>

            {program === 'E' && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <label className="block text-sm font-bold text-slate-700">Kode Kartu Digital (Tahun Lalu)</label>
                <div className="relative max-w-md">
                  <input 
                    type="text" 
                    className={`w-full bg-slate-50 border-2 rounded-2xl py-4 px-4 pr-12 outline-none transition-all ${isKodeValid === true ? 'border-emerald-500' : isKodeValid === false ? 'border-red-500' : 'border-transparent focus:border-brand-blue'}`}
                    placeholder="MACE-2023-XXXX"
                    value={kodeKartu}
                    onChange={(e) => setKodeKartu(e.target.value)}
                  />
                  <button onClick={handleValidateKode} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-brand-blue hover:bg-brand-blue/10 rounded-xl transition-colors">
                    <Search size={20} />
                  </button>
                </div>
                {isKodeValid === false && <p className="text-red-600 text-sm font-medium">Kode tidak valid atau data pendaftaran tahun lalu belum selesai.</p>}
              </div>
            )}

            <div className="flex justify-end pt-8">
               <button 
                onClick={() => setStep(2)}
                disabled={!isNimValid || !isNikValid || (program === 'E' && !isKodeValid)}
                className="gradient-blue text-white px-10 py-4 rounded-2xl font-bold premium-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
               >
                 <span>Lanjutkan ke Unggah Berkas</span>
                 <ArrowRight size={20} />
               </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { label: 'Surat Permohonan / Proposal', name: 'surat_permohonan', desc: 'PDF, Maks 5MB' },
                { label: 'Rencana Anggaran Biaya (RAB)', name: 'rab', desc: 'PDF, Maks 5MB' },
                { label: 'Kartu Mahasiswa', name: 'kartu_mahasiswa', desc: 'JPG/PDF, Maks 2MB' },
                { label: 'KTP', name: 'ktp', desc: 'JPG/PDF, Maks 2MB' },
                { label: 'Surat Keterangan Aktif', name: 'sk_aktif', desc: 'PDF, Maks 2MB' },
              ].map((field) => (
                <div key={field.name} className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">{field.label}</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      name={field.name}
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 group-hover:border-brand-blue rounded-2xl p-6 transition-all flex flex-col items-center">
                      <Upload className="text-slate-400 mb-2 group-hover:text-brand-blue" size={32} />
                      <span className="text-sm font-bold text-slate-600">{files[field.name]?.name || 'Pilih File'}</span>
                      <span className="text-[10px] text-slate-400 mt-1">{field.desc}</span>
                    </div>
                  </div>
                </div>
              ))}

              {program === 'A' && (
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">Kartu Hasil Studi (KHS)</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      name="khs"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 group-hover:border-brand-blue rounded-2xl p-6 transition-all flex flex-col items-center">
                      <Upload className="text-slate-400 mb-2 group-hover:text-brand-blue" size={32} />
                      <span className="text-sm font-bold text-slate-600">{files['khs']?.name || 'Pilih File'}</span>
                      <span className="text-[10px] text-slate-400 mt-1">PDF, Maks 2MB</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-8">
               <button onClick={() => setStep(1)} type="button" className="text-slate-500 font-bold px-10 py-4 flex items-center space-x-2">
                 <ArrowLeft size={20} />
                 <span>Kembali</span>
               </button>
               <button 
                type="submit"
                disabled={isValidating}
                className="gradient-blue text-white px-12 py-4 rounded-2xl font-bold premium-shadow flex items-center space-x-2"
               >
                 {isValidating ? <Loader2 className="animate-spin" /> : (
                   <>
                     <span>Kirim Pendaftaran</span>
                     <CheckCircle2 size={20} />
                   </>
                 )}
               </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="text-center py-12 animate-in zoom-in duration-500">
             <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center mb-8">
                <CheckCircle2 size={48} />
             </div>
             <h3 className="text-3xl font-bold text-slate-900 mb-4">Pendaftaran Berhasil Terkirim!</h3>
             <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed">
               Berkas pendaftaran anda sedang dalam proses verifikasi oleh Admin. Silakan pantau halaman <strong>Pengumuman</strong> secara berkala.
             </p>
             <button 
              onClick={() => navigate('/')}
              className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold"
             >
               Kembali ke Beranda
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendaftaranForm;
