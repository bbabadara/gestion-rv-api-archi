// src/dto/specialite/UpdateSpecialiteDto.ts
import { IsString, IsOptional } from 'class-validator';

export class UpdateSpecialiteDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  nom?: string;
}
