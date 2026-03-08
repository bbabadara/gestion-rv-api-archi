import { Patient } from '../entities/Patient';
import { PasswordUtils } from '../utils/passwordUtils';
import { AppError } from '../middlewares/errorHandler';
import { IPatientRepository } from '../repositories/interfaces/IPatientRepository';
import { v4 as uuid } from 'uuid';
import { JwtUtils } from '../utils/jwtUtils';
import { PatientRepository } from '../repositories/PatientRepository';

export class PatientService {
  private readonly patientRepository: IPatientRepository;
  constructor() {
    this.patientRepository = new PatientRepository();
  }

  async getAllPatients(): Promise<Patient[]> {
    return this.patientRepository.findAll();
  }

  async getPatientById(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new AppError('Patient non trouvé', 404);
    }
    return patient;
  }

  async createPatient(data: {
    nom: string;
    prenom: string;
    email: string;
    motDePasse: string;
    telephone: string;
    adresse?: string;
    antecedents?: string[]; // Liste d'IDs d'antécédents
  }): Promise<Patient> {
    // Validation
    if (!data.nom || !data.prenom || !data.email || !data.motDePasse || !data.telephone) {
      throw new AppError('Tous les champs obligatoires doivent être remplis', 400);
    }

    // Vérifier si l'email existe déjà
    const existingPatient = await this.patientRepository.findByEmail(data.email);
    if (existingPatient) {
      throw new AppError('Un patient avec cet email existe déjà', 400);
    }

    // Générer un numéro unique pour le patient
    const numero = `PAT-${uuid()}`;

    // Hasher le mot de passe
    const hashedPassword = await PasswordUtils.hashPassword(data.motDePasse);

    // Créer le patient
    const patient = await this.patientRepository.create({
      numero,
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      telephone: data.telephone,
      adresse: data.adresse || '',
      motDePasse: hashedPassword
    });

    // Ajouter les antécédents
    if (data.antecedents && data.antecedents.length > 0) {
      for (const antecedentId of data.antecedents) {
        await this.patientRepository.addAntecedent(patient.id, antecedentId);
      }
    }

    // Retourner le patient sans le mot de passe
    const { motDePasse, ...patientWithoutPassword } = patient as any;
    return patientWithoutPassword as Patient;
  }

  async updatePatient(
    id: string,
    data: Partial<{
      nom: string;
      prenom: string;
      telephone: string;
      adresse: string;
      motDePasse: string;
      antecedents?: string[];
    }>
  ): Promise<Patient> {
     const patient = await this.getPatientById(id);
    
    // Si on veut changer le mot de passe, il faut le hasher
    const updateData: any = { ...data };
    if (data.motDePasse) {
      updateData.motDePasse = await PasswordUtils.hashPassword(data.motDePasse);
    }

    // Retirer les antécédents de updateData car ils sont gérés séparément
    delete updateData.antecedents;

    const updatedPatient = await this.patientRepository.update(id, updateData);

    // Gérer les antécédents si fournis
    if (data.antecedents) {
      // Pour simplifier, on remplace tous les antécédents
      // Dans un vrai projet, on pourrait avoir une logique plus fine
      const patientWithAntecedents = await this.patientRepository.findByIdWithRelations(id, ['antecedents']);
      
      if (patientWithAntecedents) {
        patientWithAntecedents.antecedents = [];
        await this.patientRepository.save(patientWithAntecedents);
        
        for (const antecedentId of data.antecedents) {
          await this.patientRepository.addAntecedent(id, antecedentId);
        }
      }
    }

    const { motDePasse, ...patientWithoutPassword } = updatedPatient as any;
    return patientWithoutPassword as Patient;
  }

  async deletePatient(id: string): Promise<void> {
    await this.getPatientById(id);
    await this.patientRepository.delete(id);
  }
  

  async authenticate(email: string, password: string): Promise<{ patient: Patient; token: string }> {
    // Trouver le patient par email
    const patient = await this.patientRepository.findByEmail(email);
    if (!patient) {
      throw new AppError('Email ou mot de passe incorrect', 401);
    }

    // Vérifier le mot de passe
    const isPasswordValid = await PasswordUtils.comparePassword(
      password,
      patient.motDePasse
    );

    if (!isPasswordValid) {
      throw new AppError('Email ou mot de passe incorrect', 401);
    }

    // Générer le token JWT
    const token = JwtUtils.generateToken({ id: patient.id, email: patient.email });

    // Retourner le patient sans le mot de passe
    const { motDePasse, ...patientWithoutPassword } = patient as any;
    return { patient: patientWithoutPassword as Patient, token };
  }

  async getPatientWithAntecedents(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findByIdWithRelations(id, ['antecedents']);
    
    if (!patient) {
      throw new AppError('Patient non trouvé', 404);
    }
    
    const { motDePasse, ...patientWithoutPassword } = patient as any;
    return patientWithoutPassword as Patient;
  }
}