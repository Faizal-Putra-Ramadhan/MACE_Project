import Laporan from '../../models/Laporan.js';
import Pendaftaran from '../../models/Pendaftaran.js';
import { withMiddleware, verifyToken, mahasiswaOnly } from '../../lib/auth.js';

async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

    try {
        const user = await verifyToken(req);
        mahasiswaOnly(user);

        const list = await Laporan.findAll({
            include: [{ 
                model: Pendaftaran, 
                where: { mahasiswa_id: user.mahasiswa.id }
            }]
        });
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default withMiddleware(handler);
