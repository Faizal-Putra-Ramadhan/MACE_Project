import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import Mahasiswa from '../../models/Mahasiswa.js';
import { withMiddleware } from '../../lib/auth.js';

async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const { email, password } = req.body;

    try {
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
        res.status(500).json({ message: error.message });
    }
}

export default withMiddleware(handler);
