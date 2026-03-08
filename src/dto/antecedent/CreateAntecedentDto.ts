// src/dto/antecedent/CreateAntecedentDto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAntecedentDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  nom: string;
}
