import { withMiddleware } from '../../../../lib/auth.js';
import Pendaftaran from '../../../../models/Pendaftaran.js';

async function handler(req, res) {
    const { id } = req.query;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { status, alasan_penolakan } = req.body;

    try {
        const pendaftaran = await Pendaftaran.findByPk(id);
        if (!pendaftaran) {
            return res.status(404).json({ message: 'Pendaftaran tidak ditemukan' });
        }

        pendaftaran.status = status;
        pendaftaran.alasan_penolakan = alasan_penolakan || null;
        await pendaftaran.save();

        res.status(200).json({ message: 'Status berhasil diperbarui' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default withMiddleware(handler);
