import { withMiddleware } from '../../../lib/auth.js';

async function handler(req, res) {
    const { nik } = req.query;

    // Mock Data (NIK Papua start with 91 or 92)
    if (nik.startsWith('91') || nik.startsWith('92')) {
        res.status(200).json({ 
            valid: true, 
            data: { nik, wilayah: 'Provinsi Papua', status: 'WNI OAP' } 
        });
    } else {
        res.status(404).json({ 
            valid: false, 
            message: 'NIK tidak valid atau bukan berasal dari wilayah Papua' 
        });
    }
}

export default withMiddleware(handler);
