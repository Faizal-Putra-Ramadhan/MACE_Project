import Pendaftaran from '../../models/Pendaftaran.js';
import { withMiddleware, verifyToken, adminOnly } from '../../lib/auth.js';

async function handler(req, res) {
    try {
        const user = await verifyToken(req);
        adminOnly(user);

        // Simple stats
        const total = await Pendaftaran.count();
        const lolos = await Pendaftaran.count({ where: { status: 'lolos_berkas' } });
        
        res.status(200).json({
            totalPendaftar: total,
            lolosBerkas: lolos,
            laporanLengkap: 0 // Mock for now
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default withMiddleware(handler);
