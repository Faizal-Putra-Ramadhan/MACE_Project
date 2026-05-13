import User from '../../../models/User.js';
import { withMiddleware, verifyToken, adminOnly } from '../../../lib/auth.js';

async function handler(req, res) {
    if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' });

    try {
        const adminUser = await verifyToken(req);
        adminOnly(adminUser);

        const { id } = req.body;
        if (!id) return res.status(400).json({ message: 'User ID is required' });

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.is_approved = true;
        await user.save();

        res.status(200).json({ message: 'User approved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default withMiddleware(handler);
