// src/dto/specialite/CreateSpecialiteDto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSpecialiteDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  nom: string;
}
