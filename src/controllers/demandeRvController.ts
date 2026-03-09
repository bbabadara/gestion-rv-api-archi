import { Request, Response, NextFunction } from 'express';
import { DemandeRvService } from '../services/demandeRvService';
import { AppError } from '../middlewares/errorHandler';
import { DemandeRvMapper } from '../mapper/DemandeRvMapper';

export class DemandeRvController {
    private readonly demandeRvService: DemandeRvService;

    constructor() {
        this.demandeRvService = new DemandeRvService();

        // Bind context since these will be passed as callbacks
        this.getAllDemandes = this.getAllDemandes.bind(this);
        this.getDemandeById = this.getDemandeById.bind(this);
        this.createDemande = this.createDemande.bind(this);
        this.updateDemande = this.updateDemande.bind(this);
        this.deleteDemande = this.deleteDemande.bind(this);
        this.getDemandesByPatient = this.getDemandesByPatient.bind(this);
    }

    // GET /api/demande-rv
    async getAllDemandes(req: Request, res: Response, next: NextFunction) {
        try {
            const demandes = await this.demandeRvService.getAllDemandes();
            const dtos = demandes.map(d => DemandeRvMapper.toResponseDto(d));

            res.status(200).json({
                success: true,
                count: dtos.length,
                data: dtos,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/demande-rv/:id
    async getDemandeById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const demande = await this.demandeRvService.getDemandeById(id as string);

            res.status(200).json({
                success: true,
                data: DemandeRvMapper.toResponseDto(demande),
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/demande-rv
    async createDemande(req: Request, res: Response, next: NextFunction) {
        try {
            const { date, numero, heure, patientId, specialiteId } = req.body;

            if (!date || !numero || !heure || !patientId || !specialiteId) {
                throw new AppError('Tous les champs obligatoires doivent être remplis', 400);
            }

            const demande = await this.demandeRvService.createDemande({
                date,
                numero,
                heure,
                patientId,
                specialiteId
            });

            res.status(201).json({
                success: true,
                data: DemandeRvMapper.toResponseDto(demande),
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/demande-rv/:id
    async updateDemande(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { date, numero, heure, patientId, specialiteId, statutRV, statutDemande } = req.body;

            const demande = await this.demandeRvService.updateDemande(id as string, {
                date,
                numero,
                heure,
                patientId,
                specialiteId,
                statutRV,
                statutDemande
            });

            res.status(200).json({
                success: true,
                data: DemandeRvMapper.toResponseDto(demande),
            });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/demande-rv/:id
    async deleteDemande(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await this.demandeRvService.deleteDemande(id as string);

            res.status(204).json({
                success: true,
                data: null,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/demande-rv/patient/:patientId
    async getDemandesByPatient(req: Request, res: Response, next: NextFunction) {
        try {
            const { patientId } = req.params;
            const demandes = await this.demandeRvService.getDemandesByPatientId(patientId as string);
            const dtos = demandes.map(d => DemandeRvMapper.toResponseDto(d));

            res.status(200).json({
                success: true,
                count: dtos.length,
                data: dtos,
            });
        } catch (error) {
            next(error);
        }
    }
}
