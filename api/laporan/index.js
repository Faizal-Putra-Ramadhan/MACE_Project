import Laporan from '../../models/Laporan.js';
import { withMiddleware, verifyToken, mahasiswaOnly } from '../../lib/auth.js';

async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    try {
        const user = await verifyToken(req);
        mahasiswaOnly(user);

        const { pendaftaran_id, surat_laporan_url, fc_rekening_url, bukti_pengeluaran_url } = req.body;

        let laporan = await Laporan.findOne({ where: { pendaftaran_id } });
        
        const updateData = {};
        if (surat_laporan_url) updateData.surat_laporan_path = surat_laporan_url;
        if (fc_rekening_url) updateData.fc_rekening_path = fc_rekening_url;
        if (bukti_pengeluaran_url) updateData.bukti_pengeluaran_path = bukti_pengeluaran_url;

        if (laporan) {
            await laporan.update(updateData);
        } else {
            laporan = await Laporan.create({
                pendaftaran_id,
                ...updateData
            });
        }

        if (laporan.surat_laporan_path && laporan.fc_rekening_path && laporan.bukti_pengeluaran_path) {
            laporan.is_complete = true;
            await laporan.save();
        }

        res.status(200).json({ message: 'Laporan submitted', data: laporan });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default withMiddleware(handler);
