import { Patient } from "../../entities/Patient";
import { IBaseRepository } from "./IBaseRepository";

export interface IPatientRepository extends IBaseRepository<Patient> {
    findById(id: string): Promise<Patient | null>;
    findByEmail(email: string): Promise<Patient | null>;
    save(patient: Patient): Promise<Patient>;
    addAntecedent(patientId: string, antecedentId: string): Promise<Patient>;
    findByIdWithRelations(id: string, relations: string[]): Promise<Patient | null>;
    
}