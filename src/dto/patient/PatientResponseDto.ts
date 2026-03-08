// src/dto/patient/PatientResponseDto.ts
import { AntecedentResponseDto } from '../antecedent/AntecedentResponseDto';
import { DemandeRVResponseDto } from '../demande-rv/DemandeRVResponseDto';

export class PatientResponseDto {
  id: string;
  numero: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse: string;
  antecedents?: AntecedentResponseDto[];
  demandes?: DemandeRVResponseDto[];
}
