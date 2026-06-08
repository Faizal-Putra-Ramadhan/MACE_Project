import { withMiddleware } from '../../../lib/auth.js';

async function handler(req, res) {
    const { nim } = req.query;

    // Mock Data
    const validNims = {
        '2021001': { nama: 'John Doe Papua', status: 'Aktif', pt: 'Universitas Cenderawasih', prodi: 'Hukum', ipk: '3.50' },
        '2021002': { nama: 'Jane Smith Papua', status: 'Aktif', pt: 'Universitas Papua', prodi: 'Teknik Sipil', ipk: '3.75' },
        '2021003': { nama: 'Papua Merdeka', status: 'Aktif', pt: 'Institut Seni Budaya Papua', prodi: 'Seni Tari', ipk: '3.90' },
        '2300018199': {
            nama: 'Faizal Putra Ramadhan',
            status: 'Aktif',
            pt: 'Universitas Ahmad Dahlan',
            prodi: 'Informatika',
            ipk: '3.88'
        },
        '2604600364': {
            nama: 'Stefanus Mangge',
            status: 'Aktif',
            pt: 'Universitas Gadjah Mada',
            prodi: 'Kedokteran',
            ipk: '3.80'
        }
    };

    if (validNims[nim]) {
        res.status(200).json({ valid: true, data: validNims[nim] });
    } else {
        res.status(404).json({ valid: false, message: 'NIM tidak terdaftar di PDDikti' });
    }
}

export default withMiddleware(handler);
