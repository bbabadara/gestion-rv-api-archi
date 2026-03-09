// src/mapper/PatientMapper.ts
import { Patient } from '../entities/Patient';
import { CreatePatientDto } from '../dto/patient/CreatePatientDto';
import { UpdatePatientDto } from '../dto/patient/UpdatePatientDto';
import { PatientResponseDto } from '../dto/patient/PatientResponseDto';
import { AntecedentResponseDto } from '../dto/antecedent/AntecedentResponseDto';
import { DemandeRVResponseDto } from '../dto/demande-rv/DemandeRVResponseDto';
import { PatientBuilder } from '../builder/PatientBuilder';

export class PatientMapper {
  static toEntity(createPatientDto: CreatePatientDto): Patient {
    return new PatientBuilder()
      .setNumero(createPatientDto.numero)
      .setIdentity(createPatientDto.prenom, createPatientDto.nom)
      .setContact(createPatientDto.email, createPatientDto.telephone, createPatientDto.adresse)
      .setCredentials(createPatientDto.motDePasse)
      .build();
  }

  static toResponseDto(patient: Patient): PatientResponseDto {
    const responseDto = new PatientResponseDto();
    responseDto.id = patient.id;
    responseDto.numero = patient.numero;
    responseDto.nom = patient.nom;
    responseDto.prenom = patient.prenom;
    responseDto.telephone = patient.telephone;
    responseDto.email = patient.email;
    responseDto.adresse = patient.adresse;

    if (patient.antecedents) {
      responseDto.antecedents = patient.antecedents.map(antecedent => {
        const antecedentDto = new AntecedentResponseDto();
        antecedentDto.id = antecedent.id;
        antecedentDto.code = antecedent.code;
        antecedentDto.nom = antecedent.nom;
        return antecedentDto;
      });
    }

    if (patient.demandes) {
      responseDto.demandes = patient.demandes.map(demande => {
        const demandeDto = new DemandeRVResponseDto();
        demandeDto.id = demande.id;
        demandeDto.date = demande.date.toISOString().split('T')[0];
        demandeDto.numero = demande.numero;
        demandeDto.heure = demande.heure;
        demandeDto.statutRV = demande.statutRV;
        demandeDto.statutDemande = demande.statutDemande;
        return demandeDto;
      });
    }

    return responseDto;
  }

  static updateEntity(patient: Patient, updatePatientDto: UpdatePatientDto): Patient {
    if (updatePatientDto.numero !== undefined) {
      patient.numero = updatePatientDto.numero;
    }
    if (updatePatientDto.nom !== undefined) {
      patient.nom = updatePatientDto.nom;
    }
    if (updatePatientDto.prenom !== undefined) {
      patient.prenom = updatePatientDto.prenom;
    }
    if (updatePatientDto.telephone !== undefined) {
      patient.telephone = updatePatientDto.telephone;
    }
    if (updatePatientDto.email !== undefined) {
      patient.email = updatePatientDto.email;
    }
    if (updatePatientDto.adresse !== undefined) {
      patient.adresse = updatePatientDto.adresse;
    }
    if (updatePatientDto.motDePasse !== undefined) {
      patient.motDePasse = updatePatientDto.motDePasse;
    }
    return patient;
  }
}