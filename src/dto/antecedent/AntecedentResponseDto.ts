// src/dto/antecedent/AntecedentResponseDto.ts
import { PatientResponseDto } from '../patient/PatientResponseDto';

export class AntecedentResponseDto {
  id: string;
  code: string;
  nom: string;
  patients?: PatientResponseDto[];
}
