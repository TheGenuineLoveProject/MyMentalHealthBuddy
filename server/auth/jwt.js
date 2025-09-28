import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const JWT_SECRET = process.env.JWT_SECRET || 'mymentalhealthbuddy-jwt-secret-2024';
const JWT_EXPIRY = '30d';
export function generateToken(user) {
    return jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
}
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}
export async function comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}
export async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Access token required' });
        return;
    }
    const user = verifyToken(token);
    if (!user) {
        res.status(403).json({ error: 'Invalid or expired token' });
        return;
    }
    req.user = user;
    next();
}
export async function optionalAuthenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        const user = verifyToken(token);
        if (user) {
            req.user = user;
        }
    }
    next();
}
