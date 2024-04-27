import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET!;

export function verifyToken(signedToken: string) {
    return jwt.verify(signedToken, JWT_SECRET);
}