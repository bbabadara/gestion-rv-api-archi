// src/dto/demande-rv/CreateDemandeRVDto.ts
import { IsString, IsNotEmpty, IsDateString, IsUUID } from 'class-validator';

export class CreateDemandeRVDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsString()
  @IsNotEmpty()
  heure: string;

  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @IsUUID()
  @IsNotEmpty()
  specialiteId: string;
}
