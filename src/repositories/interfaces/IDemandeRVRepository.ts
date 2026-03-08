import { DemandeRV } from "../../entities/DemandeRV"
import { StatutDemande } from "../../enums/StatutDemande"
import { StatutRV } from "../../enums/StatutRV"
import { IBaseRepository } from "./IBaseRepository"

export interface IDemandeRVRepository extends IBaseRepository<DemandeRV> {
    findAll(): Promise<DemandeRV[]>
    findById(id: string): Promise<DemandeRV | null>
    findByPatientId(patientId: string): Promise<DemandeRV[]>
    findByStatut(statut: StatutDemande): Promise<DemandeRV[]>
    findByPatientIdAndStatut(patientId: string, statut: StatutDemande | StatutRV): Promise<DemandeRV[]>
    
}