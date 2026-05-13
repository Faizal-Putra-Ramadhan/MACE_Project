import Pendaftaran from '../../../models/Pendaftaran.js';
import { withMiddleware, verifyToken, adminOnly } from '../../../lib/auth.js';

async function handler(req, res) {
    if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' });

    try {
        const user = await verifyToken(req);
        adminOnly(user);

        const { id } = req.query;
        const { status, alasan_penolakan } = req.body;

        const pendaftaran = await Pendaftaran.findByPk(id);
        if (!pendaftaran) return res.status(404).json({ message: 'Not found' });

        await pendaftaran.update({ status, alasan_penolakan });
        res.status(200).json({ message: 'Status updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default withMiddleware(handler);
