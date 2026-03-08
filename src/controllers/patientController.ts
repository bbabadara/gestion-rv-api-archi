import { Request, Response, NextFunction } from 'express';
import { PatientService } from '../services/patientService';
import { AppError } from '../middlewares/errorHandler';

export class PatientController {
  private readonly patientService: PatientService;

  constructor() {
    this.patientService = new PatientService();
  }

  // GET /api/patients
  async getAllPatients(req: Request, res: Response, next: NextFunction) {
    try {
      const patients = await this.patientService.getAllPatients();
      res.status(200).json({
        status: 'OK',
        success: true,
        count: patients.length,
        data: patients,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/patients/:id
  async getPatientById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const patientId = Array.isArray(id) ? id[0] : id;
      const patient = await this.patientService.getPatientById(patientId);
      res.status(200).json({
        success: true,
        data: patient,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/patients
  async createPatient(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        nom,
        prenom,
        email,
        motDePasse,
        telephone,
        adresse,
        antecedents,
      } = req.body;

      // Validation basique
      if (!nom || !prenom || !email || !motDePasse || !telephone) {
        throw new AppError('Tous les champs obligatoires doivent être remplis', 400);
      }

      const patient = await this.patientService.createPatient({
        nom,
        prenom,
        email,
        motDePasse,
        telephone,
        adresse,
        antecedents,
      });

      res.status(201).json({
        success: true,
        data: patient,
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/patients/:id
  async updatePatient(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const patientId = Array.isArray(id) ? id[0] : id;
      const { nom, prenom, telephone, adresse, motDePasse, antecedents } = req.body;

      const patient = await this.patientService.updatePatient(patientId, {
        nom,
        prenom,
        telephone,
        adresse,
        motDePasse,
        antecedents,
      });

      res.status(200).json({
        success: true,
        data: patient,
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/patients/:id
  async deletePatient(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const patientId = Array.isArray(id) ? id[0] : id;
      await this.patientService.deletePatient(patientId);
      res.status(204).json({
        success: true,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/patients/login
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, motDePasse } = req.body;

      if (!email || !motDePasse) {
        throw new AppError('Email et mot de passe sont requis', 400);
      }

      const { patient, token } = await this.patientService.authenticate(
        email,
        motDePasse
      );

      res.status(200).json({
        success: true,
        token,
        data: patient,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/patients/me (pour récupérer le profil du patient connecté)
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const patientId = req.body.patientId;
      const patient = await this.patientService.getPatientById(patientId);
      res.status(200).json({
        success: true,
        data: patient,
      });
    } catch (error) {
      next(error);
    }
  }

 
}