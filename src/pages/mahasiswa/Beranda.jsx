import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, GraduationCap, Stethoscope, Users2, BookOpen, Repeat } from 'lucide-react';

const Beranda = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const programs = [
    {
      id: 'A',
      title: 'Bantuan Pembiayaan Studi Akhir',
      desc: 'Untuk mahasiswa yang sedang mengerjakan skripsi atau tugas akhir.',
      icon: GraduationCap,
      color: 'bg-blue-500',
    },
    {
      id: 'B',
      title: 'Bantuan Pembiayaan Koas',
      desc: 'Khusus mahasiswa kedokteran yang sedang menjalani masa koas (durasi 2 tahun).',
      icon: Stethoscope,
      color: 'bg-rose-500',
    },
    {
      id: 'C',
      title: 'Pendidikan Spesialis Dokter OAP',
      desc: 'Program spesialisasi bagi dokter Orang Asli Papua dengan durasi maksimal 6 tahun.',
      icon: Users2,
      color: 'bg-emerald-500',
    },
    {
      id: 'D',
      title: 'Pendidikan S3 bagi Dosen OAP',
      desc: 'Bantuan studi doktoral khusus untuk dosen Orang Asli Papua (durasi 2 tahun).',
      icon: BookOpen,
      color: 'bg-amber-500',
    },
    {
      id: 'E',
      title: 'Pendaftaran Bantuan Lanjutan',
      desc: 'Khusus penerima tahun lalu yang ingin mendaftar kembali (perlu kode kartu digital).',
      icon: Repeat,
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero / About */}
      <section className="relative overflow-hidden rounded-[2rem] gradient-blue p-12 text-white premium-shadow">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-bold mb-6">Apa itu MACE?</h2>
          <p className="text-lg text-white/90 leading-relaxed mb-8">
            Program Bantuan Pembiayaan Pendidikan bagi <span className="text-brand-gold font-bold">Orang Asli Papua (OAP)</span> yang sedang menempuh pendidikan tinggi, 
            dikelola oleh pemerintah Provinsi Papua untuk mendukung peningkatan SDM Papua yang unggul dan kompetitif.
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="bg-white/10 px-4 py-2 rounded-full border border-white/20 text-sm font-medium">Beasiswa Provinsi</span>
            <span className="bg-white/10 px-4 py-2 rounded-full border border-white/20 text-sm font-medium">Bantuan OAP</span>
            <span className="bg-white/10 px-4 py-2 rounded-full border border-white/20 text-sm font-medium">SDM Papua Unggul</span>
          </div>
        </div>
        <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-10 hidden lg:block">
           <GraduationCap size={300} />
        </div>
      </section>

      {/* Requirements */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <div className="w-2 h-8 bg-brand-gold rounded-full mr-3"></div>
            Persyaratan Umum
          </h3>
          <ul className="space-y-4">
            {[
              "Warga Negara Indonesia (WNI) Orang Asli Papua (OAP)",
              "Memiliki KTP Provinsi Papua",
              "Terdaftar aktif sebagai mahasiswa di perguruan tinggi",
              "Terdaftar di Pangkalan Data DIKTI (PDDikti)",
              "Tidak sedang menerima beasiswa lain (APBD/APBN)",
              "Memiliki rekening bank atas nama sendiri"
            ].map((req, i) => (
              <li key={i} className="flex items-start space-x-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-blue flex-shrink-0"></div>
                <span className="text-slate-600 font-medium">{req}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-brand-gold/10 rounded-[2rem] p-8 border border-brand-gold/20 flex flex-col justify-center">
           <p className="text-brand-blue font-bold text-xl italic mb-4">"Membangun Masa Depan Papua Melalui Pendidikan Tinggi yang Berkualitas."</p>
           <p className="text-slate-500 text-sm">— Pemerintah Provinsi Papua</p>
        </div>
      </section>

      {/* Program Cards */}
      <section>
        <h3 className="text-2xl font-bold mb-8">Pilih Program Bantuan</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((prog) => (
            <div key={prog.id} className="group bg-white rounded-3xl p-8 border border-slate-100 hover:border-brand-blue/30 transition-all hover:premium-shadow flex flex-col h-full">
              <div className={`${prog.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                <prog.icon size={32} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3 leading-snug">{prog.title}</h4>
              <p className="text-slate-500 mb-8 flex-1 leading-relaxed">{prog.desc}</p>
              <button 
                onClick={() => navigate(user ? `/daftar/${prog.id}` : '/login')}
                className="w-full flex items-center justify-center space-x-2 bg-slate-900 text-white group-hover:bg-brand-blue rounded-2xl py-4 font-bold transition-colors"
              >
                <span>{user ? 'Daftar Sekarang' : 'Masuk untuk Daftar'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Beranda;
