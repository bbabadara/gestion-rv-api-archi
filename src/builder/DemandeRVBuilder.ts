// src/builders/DemandeRVBuilder.ts
import { DemandeRV } from '../entities/DemandeRV';
import { Patient } from '../entities/Patient';
import { Specialite } from '../entities/Specialite';
import { StatutRV } from '../enums/StatutRV';
import { StatutDemande } from '../enums/StatutDemande';

export class DemandeRVBuilder {
  private demande: DemandeRV;

  constructor() {
    this.reset();
  }

  public reset(): this {
    this.demande = new DemandeRV();
    // Valeurs par défaut conformes aux définitions de l'entité
    this.demande.statutRV = StatutRV.EN_COURS;
    this.demande.statutDemande = StatutDemande.EN_ATTENTE;
    return this;
  }

  public setInfosSeance(date: Date, heure: string, numero: string): this {
    this.demande.date = date;
    this.demande.heure = heure;
    this.demande.numero = numero;
    return this;
  }

  public SetPatient(patient: Patient): this {
    this.demande.patient = patient;
    return this;
  }

  public SetSpecialite(specialite: Specialite): this {
    this.demande.specialite = specialite;
    return this;
  }

  public withStatuts(statutRV: StatutRV, statutDemande: StatutDemande): this {
    this.demande.statutRV = statutRV;
    this.demande.statutDemande = statutDemande;
    return this;
  }

  public build(): DemandeRV {
    // Validation simple avant création
    if (!this.demande.patient || !this.demande.specialite) {
      throw new Error("Une demande de RV doit avoir un patient et une spécialité.");
    }
    const result = this.demande;
    this.reset();
    return result;
  }
}
