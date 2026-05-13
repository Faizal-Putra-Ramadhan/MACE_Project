import { withMiddleware, verifyToken } from '../../lib/auth.js';

async function handler(req, res) {
    try {
        const user = await verifyToken(req);
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}

export default withMiddleware(handler);
