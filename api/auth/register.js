import bcrypt from 'bcryptjs';
import User from '../../models/User.js';
import Mahasiswa from '../../models/Mahasiswa.js';
import { withMiddleware } from '../../lib/auth.js';

async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const { 
        email, 
        password, 
        nim, 
        nik, 
        nama_lengkap, 
        alamat_domisili, 
        alamat_ktp, 
        nama_orang_tua 
    } = req.body;

    if (!email || !password || !nim || !nik || !nama_lengkap) {
        return res.status(400).json({ message: 'Mohon isi semua field wajib.' });
    }

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email sudah terdaftar.' });

        // Check if NIM or NIK already exists
        const existingNim = await Mahasiswa.findOne({ where: { nim } });
        if (existingNim) return res.status(400).json({ message: 'NIM sudah terdaftar.' });

        const existingNik = await Mahasiswa.findOne({ where: { nik } });
        if (existingNik) return res.status(400).json({ message: 'NIK sudah terdaftar.' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User (default is_approved = false)
        const user = await User.create({
            email,
            password: hashedPassword,
            role: 'mahasiswa',
            is_approved: false
        });

        // Create Mahasiswa
        await Mahasiswa.create({
            user_id: user.id,
            nim,
            nik,
            nama_lengkap,
            alamat_domisili,
            alamat_ktp,
            nama_orang_tua
        });

        res.status(201).json({ message: 'Pendaftaran berhasil. Silakan tunggu persetujuan Admin.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default withMiddleware(handler);
