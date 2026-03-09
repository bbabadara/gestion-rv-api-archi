import { DemandeRV } from '../entities/DemandeRV';
import { AppError } from '../middlewares/errorHandler';
import { IDemandeRVRepository } from '../repositories/interfaces/IDemandeRVRepository';
import { DemandeRVRepository } from '../repositories/DemandeRVRepository';
import { CreateDemandeRVDto } from '../dto/demande-rv/CreateDemandeRVDto';
import { UpdateDemandeRVDto } from '../dto/demande-rv/UpdateDemandeRVDto';
import { DemandeRvMapper } from '../mapper/DemandeRvMapper';
import { StatutDemande } from '../enums/StatutDemande';
import { StatutRV } from '../enums/StatutRV';

export class DemandeRvService {
    private readonly demandeRVRepository: IDemandeRVRepository;

    constructor() {
        this.demandeRVRepository = new DemandeRVRepository();
    }

    async getAllDemandes(): Promise<DemandeRV[]> {
        return this.demandeRVRepository.findAll();
    }

    async getDemandeById(id: string): Promise<DemandeRV> {
        const demande = await this.demandeRVRepository.findById(id);
        if (!demande) {
            throw new AppError('Demande de rendez-vous non trouvée', 404);
        }
        return demande;
    }

    async createDemande(dto: CreateDemandeRVDto): Promise<DemandeRV> {
        // Utilisation du builder via le mapper pour créer l'entité
        const entity = DemandeRvMapper.toEntity(dto);

        // Le repository créera la demande. entity.patient et entity.specialite sont déjà structurés.
        return this.demandeRVRepository.create(entity as any);
    }

    async updateDemande(id: string, dto: UpdateDemandeRVDto): Promise<DemandeRV> {
        const existing = await this.getDemandeById(id);
        const updatedEntity = DemandeRvMapper.updateEntity(existing, dto);

        return this.demandeRVRepository.update(id, updatedEntity as any);
    }

    async deleteDemande(id: string): Promise<void> {
        await this.getDemandeById(id);
        await this.demandeRVRepository.delete(id);
    }

    async getDemandesByPatientId(patientId: string): Promise<DemandeRV[]> {
        return this.demandeRVRepository.findByPatientId(patientId);
    }

    async getDemandesByStatut(statut: StatutDemande): Promise<DemandeRV[]> {
        return this.demandeRVRepository.findByStatut(statut);
    }
}
