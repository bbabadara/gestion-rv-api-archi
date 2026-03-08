// src/entities/Patient.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Antecedent } from './Antecedent';
import { DemandeRV } from './DemandeRV';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string; 

  @Column()
  numero: string;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column()
  telephone: string;

  @Column({ unique: true })
  email: string;

  @Column()
  adresse: string; 

  @Column()
  motDePasse: string;

  @ManyToMany(() => Antecedent, antecedent => antecedent.patients)
  @JoinTable()
  antecedents: Antecedent[];

  @OneToMany(() => DemandeRV, demande => demande.patient)
  demandes: DemandeRV[];
}