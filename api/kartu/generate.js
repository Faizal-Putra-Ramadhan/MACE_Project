import Pendaftaran from '../../models/Pendaftaran.js';
import crypto from 'crypto';
import { withMiddleware, verifyToken, mahasiswaOnly } from '../../lib/auth.js';

async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    try {
        const user = await verifyToken(req);
        mahasiswaOnly(user);

        const { pendaftaran_id } = req.body;
        const year = new Date().getFullYear();
        const random = crypto.randomBytes(3).toString('hex').toUpperCase();
        const kode = `MACE-${year}-${random}`;

        const pendaftaran = await Pendaftaran.findByPk(pendaftaran_id);
        if (!pendaftaran) return res.status(404).json({ message: 'Not found' });

        pendaftaran.kode_kartu = kode;
        pendaftaran.status = 'selesai';
        await pendaftaran.save();

        res.status(200).json({ kode });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default withMiddleware(handler);
