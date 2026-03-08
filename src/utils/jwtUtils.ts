import jwt, { SignOptions } from 'jsonwebtoken';

export class JwtUtils {
  static generateToken(payload: object): string {
    const secret = process.env.JWT_SECRET || 'default-secret-change-in-production';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    
    const options: SignOptions = {
      expiresIn: expiresIn as any
    };
    
    return jwt.sign(payload, secret, options);
  }

  static verifyToken(token: string): any {
    const secret = process.env.JWT_SECRET || 'default-secret-change-in-production';
    return jwt.verify(token, secret);
  }
}