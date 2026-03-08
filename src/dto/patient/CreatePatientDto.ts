// src/dto/patient/CreatePatientDto.ts
import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  prenom: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  adresse: string;

  @IsString()
  @MinLength(6)
  motDePasse: string;
}
