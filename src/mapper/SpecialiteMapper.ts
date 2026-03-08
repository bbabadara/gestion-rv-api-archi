// src/mapper/SpecialiteMapper.ts
import { Specialite } from '../entities/Specialite';
import { CreateSpecialiteDto } from '../dto/specialite/CreateSpecialiteDto';
import { UpdateSpecialiteDto } from '../dto/specialite/UpdateSpecialiteDto';
import { SpecialiteResponseDto } from '../dto/specialite/SpecialiteResponseDto';

export class SpecialiteMapper {
  static toEntity(createSpecialiteDto: CreateSpecialiteDto): Specialite {
    const specialite = new Specialite();
    specialite.code = createSpecialiteDto.code;
    specialite.nom = createSpecialiteDto.nom;
    return specialite;
  }

  static toResponseDto(specialite: Specialite): SpecialiteResponseDto {
    const responseDto = new SpecialiteResponseDto();
    responseDto.id = specialite.id;
    responseDto.code = specialite.code;
    responseDto.nom = specialite.nom;
    return responseDto;
  }

  static updateEntity(specialite: Specialite, updateSpecialiteDto: UpdateSpecialiteDto): Specialite {
    if (updateSpecialiteDto.code !== undefined) {
      specialite.code = updateSpecialiteDto.code;
    }
    if (updateSpecialiteDto.nom !== undefined) {
      specialite.nom = updateSpecialiteDto.nom;
    }
    return specialite;
  }
}
