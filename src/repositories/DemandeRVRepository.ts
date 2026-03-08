import { EntityTarget } from 'typeorm';
import { DemandeRV } from '../entities/DemandeRV';
import { BaseRepository } from './BaseRepository';
import { StatutDemande } from '../enums/StatutDemande';
import { StatutRV } from '../enums/StatutRV';
import { IDemandeRVRepository } from './interfaces/IDemandeRVRepository';

export class DemandeRVRepository extends BaseRepository<DemandeRV> implements IDemandeRVRepository {
  constructor() {
    super(DemandeRV as EntityTarget<DemandeRV>);
  }

  async findAll(): Promise<DemandeRV[]> {
    return this.repository.find({
      relations: ['patient', 'specialite']
    });
  }

  async findById(id: string): Promise<DemandeRV | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['patient', 'specialite']
    });
  }

  async findByPatientId(patientId: string): Promise<DemandeRV[]> {
    return this.repository.find({
      where: { patient: { id: patientId } },
      relations: ['patient', 'specialite'],
      order: { date: 'DESC' }
    });
  }

  async findByStatut(statut: StatutDemande): Promise<DemandeRV[]> {
    return this.repository.find({
      where: { statutDemande: statut },
      relations: ['patient', 'specialite'],
      order: { date: 'ASC' }
    });
  }

  async findByPatientIdAndStatut(
    patientId: string,
    statut: StatutDemande | StatutRV
  ): Promise<DemandeRV[]> {
    // Vérifier si c'est un StatutDemande ou StatutRV
    const isStatutDemande = Object.values(StatutDemande).includes(statut as StatutDemande);
    
    if (isStatutDemande) {
      return this.repository.find({
        where: { 
          patient: { id: patientId },
          statutDemande: statut as StatutDemande
        },
        relations: ['patient', 'specialite'],
        order: { date: 'ASC' }
      });
    } else {
      return this.repository.find({
        where: { 
          patient: { id: patientId },
          statutRV: statut as StatutRV
        },
        relations: ['patient', 'specialite'],
        order: { date: 'ASC' }
      });
    }
  }
}