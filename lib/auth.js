import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Mahasiswa from '../models/Mahasiswa.js';

export const withMiddleware = (handler) => async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, authorization'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    let token = authHeader && authHeader.split(' ')[1];
    
    let source = 'header';
    if (!token && req.query.token) {
        token = req.query.token;
        source = 'query';
    }

    if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ 
            message: 'Authentication required',
            debug: {
                has_header: !!authHeader,
                has_query: !!req.query.token,
                token_value: token,
                source: source
            }
        });
    }

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id, {
            include: [{ model: Mahasiswa }]
        });

        if (!user) {
            return res.status(401).json({ message: 'User no longer exists' });
        }

        req.user = user;
        return handler(req, res);
    } catch (error) {
        console.error('[Auth Middleware Error]:', error.message);
        return res.status(401).json({ 
            message: 'Invalid or expired token',
            error: error.message 
        });
    }
};

export const verifyToken = async (req) => {
    return req.user;
};

export const adminOnly = (user) => {
    if (user.role !== 'admin') throw new Error('Admin access required');
};

export const mahasiswaOnly = (user) => {
    if (user.role !== 'mahasiswa') throw new Error('Mahasiswa access required');
};
