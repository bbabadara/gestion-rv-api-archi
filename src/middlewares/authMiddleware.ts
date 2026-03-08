import { Request, Response, NextFunction } from 'express';
import { JwtUtils } from '../utils/jwtUtils';
import { AppError } from './errorHandler';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Vérifier la présence du token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Veuillez vous connecter pour accéder à cette ressource', 401);
    }

    const token = authHeader.split(' ')[1];

    // Vérifier le token
    const decoded: any = JwtUtils.verifyToken(token);
    
    // Ajouter l'ID du patient à la requête
    req.body.patientId = decoded.id;
    
    next();
  } catch (error:any) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Token invalide', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expiré', 401));
    }
    next(error);
  }  

};