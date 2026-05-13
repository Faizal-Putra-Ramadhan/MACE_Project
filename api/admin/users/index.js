import User from '../../../models/User.js';
import Mahasiswa from '../../../models/Mahasiswa.js';
import { withMiddleware, verifyToken, adminOnly } from '../../../lib/auth.js';

async function handler(req, res) {
    try {
        const user = await verifyToken(req);
        adminOnly(user);

        const list = await User.findAll({
            include: [{ model: Mahasiswa }]
        });
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default withMiddleware(handler);
