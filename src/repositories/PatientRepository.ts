// src/repositories/PatientRepository.ts
import { EntityTarget } from 'typeorm';
import { Patient } from '../entities/Patient';
import { Antecedent } from '../entities/Antecedent';
import { BaseRepository } from './BaseRepository';
import { AppDataSource } from '../config/database';
import { IPatientRepository } from './interfaces/IPatientRepository';

export class PatientRepository  extends BaseRepository<Patient> implements IPatientRepository {
  constructor() {
    super(Patient as EntityTarget<Patient>);
  }

  async findByEmail(email: string): Promise<Patient | null> {
    return this.repository.findOne({
      where: { email },
      relations: ['antecedents']
    });
  }

  async findByIdWithRelations(id: string, relations: string[] = ['antecedents']): Promise<Patient | null> {
    return this.repository.findOne({
      where: { id },
      relations
    });
  }

  async addAntecedent(patientId: string, antecedentId: string): Promise<Patient> {
    const patient = await this.repository.findOne({
      where: { id: patientId },
      relations: ['antecedents']
    });
    
    if (!patient) {
      throw new Error('Patient non trouvé');
    }

    const antecedentRepository = AppDataSource.getRepository(Antecedent);
    const antecedent = await antecedentRepository.findOneBy({ id: antecedentId });
    
    if (!antecedent) {
      throw new Error('Antécédent non trouvé');
    }

    if (!patient.antecedents) {
      patient.antecedents = [];
    }
    
    // Vérifier si l'antécédent n'est pas déjà associé
    if (!patient.antecedents.some(a => a.id === antecedentId)) {
      patient.antecedents.push(antecedent);
      return this.save(patient);
    }
    
    return patient;
  }
}