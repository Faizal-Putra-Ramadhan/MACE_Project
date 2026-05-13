import Mahasiswa from '../../models/Mahasiswa.js';
import Pendidikan from '../../models/Pendidikan.js';
import { withMiddleware, verifyToken, mahasiswaOnly } from '../../lib/auth.js';

async function handler(req, res) {
    if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' });

    try {
        const user = await verifyToken(req);
        mahasiswaOnly(user);

        const { dataDiri, dataPendidikan } = req.body;
        const mahasiswa = await Mahasiswa.findOne({ where: { user_id: user.id } });
        
        if (!mahasiswa) return res.status(404).json({ message: 'Not found' });

        await mahasiswa.update(dataDiri);

        const [pendidikan, created] = await Pendidikan.findOrCreate({
            where: { mahasiswa_id: mahasiswa.id },
            defaults: { ...dataPendidikan, mahasiswa_id: mahasiswa.id }
        });

        if (!created) {
            await pendidikan.update(dataPendidikan);
        }

        res.status(200).json({ message: 'Data updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default withMiddleware(handler);
