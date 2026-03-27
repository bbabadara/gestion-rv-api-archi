import { Request, Response, NextFunction } from 'express';
import { PatientService, invalidatePatientToken } from '../services/patientService';
import { AppError } from '../middlewares/errorHandler';
import { JwtUtils } from '../utils/jwtUtils';

export class PatientController {
  private readonly patientService: PatientService;

  constructor() {
    this.patientService = new PatientService();

    this.getAllPatients = this.getAllPatients.bind(this);
    this.getPatientById = this.getPatientById.bind(this);
    this.createPatient = this.createPatient.bind(this);
    this.updatePatient = this.updatePatient.bind(this);
    this.deletePatient = this.deletePatient.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.getProfile = this.getProfile.bind(this);
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

      // Generate a token so the user is instantly logged in
      const token = JwtUtils.generateToken({ id: patient.id, email: patient.email });

      res.status(201).json({
        success: true,
        token,
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
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        invalidatePatientToken(token);
        JwtUtils.blacklistToken(token);
      }
      
      await this.patientService.deletePatient(patientId);
      res.status(200).json({
        success: true,
        message: 'Compte supprimé avec succès. Tous les tokens ont été invalidés.',
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

  // POST /api/patients/logout
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        JwtUtils.blacklistToken(token);
      }
      
      res.status(200).json({
        success: true,
        message: 'Déconnexion réussie. Le token a été invalidée.'
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