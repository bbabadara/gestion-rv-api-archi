// src/builders/PatientBuilder.ts
import { Patient } from '../entities/Patient';
import { Antecedent } from '../entities/Antecedent';

export class PatientBuilder {
  private patient: Patient;

  constructor() {
    this.reset();
  }

  public reset(): this {
    this.patient = new Patient();
    this.patient.antecedents = [];
    this.patient.demandes = [];
    return this;
  }

  public setIdentity(prenom: string, nom: string): this {
    this.patient.prenom = prenom;
    this.patient.nom = nom;
    return this;
  }

  public setContact(email: string, telephone: string, adresse: string): this {
    this.patient.email = email;
    this.patient.telephone = telephone;
    this.patient.adresse = adresse;
    return this;
  }

  public setCredentials(motDePasse: string): this {
    this.patient.motDePasse = motDePasse;
    return this;
  }

  public setNumero(numero: string): this {
    this.patient.numero = numero;
    return this;
  }

  public addAntecedent(antecedent: Antecedent): this {
    this.patient.antecedents.push(antecedent);
    return this;
  }

  // Retourne l'entité finale prête à être sauvegardée par le Repository
   
  public build(): Patient {
    const result = this.patient;
    this.reset(); 
    return result;
  }
}