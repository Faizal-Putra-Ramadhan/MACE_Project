import { withMiddleware } from '../../../lib/auth.js';

async function handler(req, res) {
    const { nim } = req.query;
    
    // Mock Data
    const validNims = {
        '2021001': { nama: 'John Doe Papua', status: 'Aktif', pt: 'Universitas Cenderawasih' },
        '2021002': { nama: 'Jane Smith Papua', status: 'Aktif', pt: 'Universitas Papua' },
        '2021003': { nama: 'Papua Merdeka', status: 'Aktif', pt: 'Institut Seni Budaya Papua' }
    };

    if (validNims[nim]) {
        res.status(200).json({ valid: true, data: validNims[nim] });
    } else {
        res.status(404).json({ valid: false, message: 'NIM tidak terdaftar di PDDikti' });
    }
}

export default withMiddleware(handler);
