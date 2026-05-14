import { withMiddleware } from '../../../../lib/auth.js';
import Pendaftaran from '../../../../models/Pendaftaran.js';

async function handler(req, res) {
    const { id } = req.query;

    console.log(`[Admin Update Status] ID: ${id}, Body:`, req.body);

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
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

        console.log(`[Admin Update Status] Current Status: ${pendaftaran.status} -> New Status: ${status}`);

        pendaftaran.status = status;
        pendaftaran.alasan_penolakan = alasan_penolakan || null;
        pendaftaran.nominal_dana = nominal_dana || pendaftaran.nominal_dana;
        await pendaftaran.save();

        res.status(200).json({ message: 'Status berhasil diperbarui' });
    } catch (error) {
        console.error('[Admin Update Status Error]:', error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

export default withMiddleware(handler);
