// src/dto/patient/UpdatePatientDto.ts
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdatePatientDto {
  @IsString()
  @IsOptional()
  numero?: string;

  @IsString()
  @IsOptional()
  nom?: string;

  @IsString()
  @IsOptional()
  prenom?: string;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  adresse?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  motDePasse?: string;
}
