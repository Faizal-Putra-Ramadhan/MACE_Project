import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Mahasiswa from '../../models/Mahasiswa.js';
import User from '../../models/User.js';
import { withMiddleware } from '../../lib/auth.js';

async function handler(req, res) {
    if (req.method !== 'POST' && req.method !== 'GET') {
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }

    console.log(`[Login] Method: ${req.method}, Body:`, req.body);

    const { email, password } = req.body;

    try {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not defined');
        }
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const user = await User.findOne({ 
            where: { email },
            include: [{ model: Mahasiswa }] 
        });
        
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        if (user.role === 'mahasiswa' && !user.is_approved) {
            return res.status(403).json({ message: 'Akun Anda sedang menunggu persetujuan Admin.' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                mahasiswa: user.mahasiswa
            }
        });
    } catch (error) {
        console.error('[Login Error]:', error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

export default withMiddleware(handler);
