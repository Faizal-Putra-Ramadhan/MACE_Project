import { withMiddleware } from '../../../lib/auth.js';
import Pendaftaran from '../../../models/Pendaftaran.js';
import Mahasiswa from '../../../models/Mahasiswa.js';
import DokumenPendaftaran from '../../../models/DokumenPendaftaran.js';

async function handler(req, res) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const list = await Pendaftaran.findAll({
            include: [
                { model: Mahasiswa },
                { model: DokumenPendaftaran }
            ],
            order: [['created_at', 'DESC']]
        });
        res.status(200).json(list);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export default withMiddleware(handler);
