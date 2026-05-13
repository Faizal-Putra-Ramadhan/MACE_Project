import Pendaftaran from '../../models/Pendaftaran.js';
import DokumenPendaftaran from '../../models/DokumenPendaftaran.js';
import { withMiddleware, verifyToken, mahasiswaOnly } from '../../lib/auth.js';

async function handler(req, res) {
    try {
        const user = await verifyToken(req);

        if (req.method === 'POST') {
            mahasiswaOnly(user);
            const { program, documents } = req.body; // documents is an array of { jenis, url }

            const pendaftaran = await Pendaftaran.create({
                mahasiswa_id: user.mahasiswa.id,
                program,
                status: 'submitted'
            });

            if (documents && Array.isArray(documents)) {
                const docsToCreate = documents.map(doc => ({
                    pendaftaran_id: pendaftaran.id,
                    jenis_dokumen: doc.jenis,
                    file_path: doc.url
                }));
                await DokumenPendaftaran.bulkCreate(docsToCreate);
            }

            return res.status(201).json({ message: 'Pendaftaran berhasil', id: pendaftaran.id });
        }

        if (req.method === 'GET') {
            const list = await Pendaftaran.findAll({
                where: { mahasiswa_id: user.mahasiswa?.id || 0 },
                include: [{ model: DokumenPendaftaran }]
            });
            return res.status(200).json(list);
        }

        res.status(405).json({ message: 'Method not allowed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default withMiddleware(handler);
