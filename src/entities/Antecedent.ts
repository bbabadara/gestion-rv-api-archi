// src/entities/Antecedent.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Patient } from './Patient';

@Entity()
export class Antecedent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  nom: string;

  @ManyToMany(() => Patient, patient => patient.antecedents)
  @JoinTable()
  patients: Patient[];
}