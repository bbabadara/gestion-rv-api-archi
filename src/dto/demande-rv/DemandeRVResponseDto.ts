// src/dto/demande-rv/DemandeRVResponseDto.ts
import { PatientResponseDto } from '../patient/PatientResponseDto';
import { SpecialiteResponseDto } from '../specialite/SpecialiteResponseDto';
import { StatutRV } from '../../enums/StatutRV';
import { StatutDemande } from '../../enums/StatutDemande';

export class DemandeRVResponseDto {
  id: string;
  date: string;
  numero: string;
  heure: string;
  patient: PatientResponseDto;
  specialite: SpecialiteResponseDto;
  statutRV: StatutRV;
  statutDemande: StatutDemande;
}
