// src/entities/DemandeRV.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './Patient';
import { Specialite } from './Specialite';
import { StatutRV } from '../enums/StatutRV';
import { StatutDemande } from '../enums/StatutDemande';

@Entity()
export class DemandeRV {
  @PrimaryGeneratedColumn('uuid')
  id: string; 

  @Column({ type: 'date' })
  date: Date;

  @Column()
  numero: string;

  @Column()
  heure: string;

  @ManyToOne(() => Patient, patient => patient.demandes)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @ManyToOne(() => Specialite)
  @JoinColumn({ name: 'specialiteId' })
  specialite: Specialite;

  @Column({
    type: 'enum',
    enum: StatutRV,
    default: StatutRV.EN_COURS
  })
  statutRV: StatutRV;

  @Column({
    type: 'enum',
    enum: StatutDemande,
    default: StatutDemande.EN_ATTENTE
  })
  statutDemande: StatutDemande;
}