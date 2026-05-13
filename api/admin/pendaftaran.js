import Pendaftaran from '../../models/Pendaftaran.js';
import Mahasiswa from '../../models/Mahasiswa.js';
import DokumenPendaftaran from '../../models/DokumenPendaftaran.js';
import { withMiddleware, verifyToken, adminOnly } from '../../lib/auth.js';

async function handler(req, res) {
    try {
        const user = await verifyToken(req);
        adminOnly(user);

        const list = await Pendaftaran.findAll({
            include: [
                { model: Mahasiswa },
                { model: DokumenPendaftaran }
            ],
            order: [['created_at', 'DESC']]
        });
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default withMiddleware(handler);
