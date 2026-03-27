import jwt, { JwtPayload } from 'jsonwebtoken';

const BLACKLIST = new Set<string>();

export class JwtUtils {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

  static generateToken(payload: object): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
    });
  }

  static verifyToken(token: string): JwtPayload {
    if (this.isBlacklisted(token)) {
      throw new Error('Token has been revoked');
    }
    return jwt.verify(token, this.JWT_SECRET) as JwtPayload;
  }

  static blacklistToken(token: string): void {
    try {
      const decoded = jwt.decode(token) as JwtPayload;
      if (decoded && decoded.exp) {
        const expiresIn = decoded.exp * 1000 - Date.now();
        if (expiresIn > 0) {
          BLACKLIST.add(token);
          setTimeout(() => {
            BLACKLIST.delete(token);
          }, expiresIn);
        }
      }
    } catch {
      BLACKLIST.add(token);
    }
  }

  static isBlacklisted(token: string): boolean {
    return BLACKLIST.has(token);
  }
}
