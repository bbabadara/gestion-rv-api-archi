import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';

export const validateDto =
  (dtoClass: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(dtoClass, req.body);

    const errors = await validate(dto, {
      whitelist: true, // supprime les champs non définis dans le DTO
      forbidNonWhitelisted: true // erreur si champ en trop
    });

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation error',
        errors: errors.map(err => ({
          field: err.property,
          errors: Object.values(err.constraints || {})
        }))
      });
    }

    req.body = dto;
    next();
  };