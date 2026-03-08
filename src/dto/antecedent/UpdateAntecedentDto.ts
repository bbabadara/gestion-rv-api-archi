// src/dto/antecedent/UpdateAntecedentDto.ts
import { IsString, IsOptional } from 'class-validator';

export class UpdateAntecedentDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  nom?: string;
}
