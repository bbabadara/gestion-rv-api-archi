// src/mapper/DemandeRvMapper.ts
import { DemandeRV } from '../entities/DemandeRV';
import { CreateDemandeRVDto } from '../dto/demande-rv/CreateDemandeRVDto';
import { UpdateDemandeRVDto } from '../dto/demande-rv/UpdateDemandeRVDto';
import { DemandeRVResponseDto } from '../dto/demande-rv/DemandeRVResponseDto';
import { PatientResponseDto } from '../dto/patient/PatientResponseDto';
import { SpecialiteResponseDto } from '../dto/specialite/SpecialiteResponseDto';
import { Patient } from '../entities/Patient';
import { Specialite } from '../entities/Specialite';

export class DemandeRvMapper {
  static toEntity(createDemandeRVDto: CreateDemandeRVDto): DemandeRV {
    const demande = new DemandeRV();
    demande.date = new Date(createDemandeRVDto.date);
    demande.numero = createDemandeRVDto.numero;
    demande.heure = createDemandeRVDto.heure;
    
    const patient = new Patient();
    patient.id = createDemandeRVDto.patientId;
    demande.patient = patient;
    
    const specialite = new Specialite();
    specialite.id = createDemandeRVDto.specialiteId;
    demande.specialite = specialite;
    
    return demande;
  }

  static toResponseDto(demande: DemandeRV): DemandeRVResponseDto {
    const responseDto = new DemandeRVResponseDto();
    responseDto.id = demande.id;
    responseDto.date = demande.date.toISOString().split('T')[0];
    responseDto.numero = demande.numero;
    responseDto.heure = demande.heure;
    responseDto.statutRV = demande.statutRV;
    responseDto.statutDemande = demande.statutDemande;
    
    if (demande.patient) {
      const patientDto = new PatientResponseDto();
      patientDto.id = demande.patient.id;
      patientDto.numero = demande.patient.numero;
      patientDto.nom = demande.patient.nom;
      patientDto.prenom = demande.patient.prenom;
      patientDto.telephone = demande.patient.telephone;
      patientDto.email = demande.patient.email;
      patientDto.adresse = demande.patient.adresse;
      responseDto.patient = patientDto;
    }
    
    if (demande.specialite) {
      const specialiteDto = new SpecialiteResponseDto();
      specialiteDto.id = demande.specialite.id;
      specialiteDto.code = demande.specialite.code;
      specialiteDto.nom = demande.specialite.nom;
      responseDto.specialite = specialiteDto;
    }
    
    return responseDto;
  }

  static updateEntity(demande: DemandeRV, updateDemandeRVDto: UpdateDemandeRVDto): DemandeRV {
    if (updateDemandeRVDto.date !== undefined) {
      demande.date = new Date(updateDemandeRVDto.date);
    }
    if (updateDemandeRVDto.numero !== undefined) {
      demande.numero = updateDemandeRVDto.numero;
    }
    if (updateDemandeRVDto.heure !== undefined) {
      demande.heure = updateDemandeRVDto.heure;
    }
    if (updateDemandeRVDto.patientId !== undefined) {
      const patient = new Patient();
      patient.id = updateDemandeRVDto.patientId;
      demande.patient = patient;
    }
    if (updateDemandeRVDto.specialiteId !== undefined) {
      const specialite = new Specialite();
      specialite.id = updateDemandeRVDto.specialiteId;
      demande.specialite = specialite;
    }
    if (updateDemandeRVDto.statutRV !== undefined) {
      demande.statutRV = updateDemandeRVDto.statutRV;
    }
    if (updateDemandeRVDto.statutDemande !== undefined) {
      demande.statutDemande = updateDemandeRVDto.statutDemande;
    }
    return demande;
  }
}