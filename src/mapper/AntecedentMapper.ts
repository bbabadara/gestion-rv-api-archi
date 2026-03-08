// src/mapper/AntecedentMapper.ts
import { Antecedent } from '../entities/Antecedent';
import { CreateAntecedentDto } from '../dto/antecedent/CreateAntecedentDto';
import { UpdateAntecedentDto } from '../dto/antecedent/UpdateAntecedentDto';
import { AntecedentResponseDto } from '../dto/antecedent/AntecedentResponseDto';
import { PatientResponseDto } from '../dto/patient/PatientResponseDto';

export class AntecedentMapper {
  static toEntity(createAntecedentDto: CreateAntecedentDto): Antecedent {
    const antecedent = new Antecedent();
    antecedent.code = createAntecedentDto.code;
    antecedent.nom = createAntecedentDto.nom;
    return antecedent;
  }

  static toResponseDto(antecedent: Antecedent): AntecedentResponseDto {
    const responseDto = new AntecedentResponseDto();
    responseDto.id = antecedent.id;
    responseDto.code = antecedent.code;
    responseDto.nom = antecedent.nom;
    
    if (antecedent.patients) {
      responseDto.patients = antecedent.patients.map(patient => {
        const patientDto = new PatientResponseDto();
        patientDto.id = patient.id;
        patientDto.numero = patient.numero;
        patientDto.nom = patient.nom;
        patientDto.prenom = patient.prenom;
        patientDto.telephone = patient.telephone;
        patientDto.email = patient.email;
        patientDto.adresse = patient.adresse;
        return patientDto;
      });
    }
    
    return responseDto;
  }

  static updateEntity(antecedent: Antecedent, updateAntecedentDto: UpdateAntecedentDto): Antecedent {
    if (updateAntecedentDto.code !== undefined) {
      antecedent.code = updateAntecedentDto.code;
    }
    if (updateAntecedentDto.nom !== undefined) {
      antecedent.nom = updateAntecedentDto.nom;
    }
    return antecedent;
  }
}
