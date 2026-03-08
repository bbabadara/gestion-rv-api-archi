// src/dto/demande-rv/UpdateDemandeRVDto.ts
import { IsString, IsOptional, IsDateString, IsUUID, IsEnum } from 'class-validator';
import { StatutRV } from '../../enums/StatutRV';
import { StatutDemande } from '../../enums/StatutDemande';

export class UpdateDemandeRVDto {
  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  numero?: string;

  @IsString()
  @IsOptional()
  heure?: string;

  @IsUUID()
  @IsOptional()
  patientId?: string;

  @IsUUID()
  @IsOptional()
  specialiteId?: string;

  @IsEnum(StatutRV)
  @IsOptional()
  statutRV?: StatutRV;

  @IsEnum(StatutDemande)
  @IsOptional()
  statutDemande?: StatutDemande;
}
