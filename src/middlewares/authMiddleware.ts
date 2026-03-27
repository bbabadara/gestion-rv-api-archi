import { Request, Response, NextFunction } from 'express';
import { JwtUtils } from '../utils/jwtUtils';
import { AppError } from './errorHandler';
import { isPatientTokenInvalidated } from '../services/patientService';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Veuillez vous connecter pour accéder à cette ressource', 401);
    }

    const token = authHeader.split(' ')[1];

    if (isPatientTokenInvalidated(token)) {
      throw new AppError('Session expirée suite à une modification du compte', 401);
    }

    const decoded: any = JwtUtils.verifyToken(token);
    
    if (!req.body) req.body = {};
    req.body.patientId = decoded.id;
    
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Token invalide', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expiré', 401));
    }
    if (error.message === 'Token has been revoked') {
      return next(new AppError('Token révoqué', 401));
    }
    next(error);
  }  

};