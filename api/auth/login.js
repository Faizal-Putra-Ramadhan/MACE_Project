import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Mahasiswa from '../../models/Mahasiswa.js';
import User from '../../models/User.js';
import { withMiddleware } from '../../lib/auth.js';

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { password } = req.body;
    const email = req.body.email ? req.body.email.trim().toLowerCase() : '';

    try {
        if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
            throw new Error('Missing environment variables');
        }

        const user = await User.findOne({ 
            where: { email },
            include: [{ model: Mahasiswa }] 
        });

        if (!user) {
            return res.status(400).json({ message: 'Email tidak ditemukan' });
        }

        if (!user.is_approved) {
            return res.status(400).json({ message: 'Akun Anda belum disetujui oleh admin' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password salah' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                nama: user.role === 'admin' ? 'Admin' : (user.mahasiswa ? user.mahasiswa.nama_lengkap : 'User')
            }
        });
    } catch (error) {
        console.error('[Login Error]:', error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

export default withMiddleware(handler);
