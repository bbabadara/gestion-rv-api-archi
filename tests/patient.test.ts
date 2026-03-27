import request from 'supertest';
import app from '../src/app';
import { PatientService } from '../src/services/patientService';
import { JwtUtils } from '../src/utils/jwtUtils';

jest.mock('../src/services/patientService');
jest.mock('../src/config/database', () => ({
  AppDataSource: {
    isInitialized: true,
    initialize: jest.fn().mockResolvedValue({}),
    getRepository: jest.fn(),
  },
  initializeDatabase: jest.fn().mockResolvedValue(undefined),
}));

describe('Patient Controller', () => {
  let mockPatientService: jest.Mocked<PatientService>;
  let validToken: string;

  beforeAll(() => {
    validToken = JwtUtils.generateToken({ id: 'test-id', email: 'test@example.com' });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockPatientService = new PatientService() as jest.Mocked<PatientService>;
  });

  describe('POST /api/patients', () => {
    it('should create a patient and return 201', async () => {
      const patientData = {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean@example.com',
        motDePasse: 'password123',
        telephone: '0612345678',
        adresse: '123 Rue de la Paix',
      };

      const mockPatient = {
        id: 'uuid-123',
        numero: 'PAT-123',
        ...patientData,
        motDePasse: 'hashed_password',
      };

      (PatientService as jest.MockedClass<typeof PatientService>).mockImplementation(() => {
        const service = {
          createPatient: jest.fn().mockResolvedValue(mockPatient),
        } as any;
        return service;
      });

      const response = await request(app)
        .post('/api/patients')
        .send(patientData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.token).toBeDefined();
    });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/patients')
        .send({ nom: 'Dupont' });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/patients/login', () => {
    it('should login successfully and return 200', async () => {
      const mockPatient = {
        id: 'uuid-123',
        nom: 'Dupont',
        email: 'jean@example.com',
      };

      (PatientService as jest.MockedClass<typeof PatientService>).mockImplementation(() => {
        const service = {
          authenticate: jest.fn().mockResolvedValue({ patient: mockPatient, token: validToken }),
        } as any;
        return service;
      });

      const response = await request(app)
        .post('/api/patients/login')
        .send({ email: 'jean@example.com', motDePasse: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    it('should return 400 when credentials are missing', async () => {
      const response = await request(app)
        .post('/api/patients/login')
        .send({ email: 'jean@example.com' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/patients (protected)', () => {
    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/patients');

      expect(response.status).toBe(401);
    });

    it('should return 200 with valid token', async () => {
      const mockPatients = [
        { id: 'uuid-1', nom: 'Dupont', email: 'dupont@example.com' },
        { id: 'uuid-2', nom: 'Martin', email: 'martin@example.com' },
      ];

      (PatientService as jest.MockedClass<typeof PatientService>).mockImplementation(() => {
        const service = {
          getAllPatients: jest.fn().mockResolvedValue(mockPatients),
        } as any;
        return service;
      });

      const response = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
    });
  });

  describe('POST /api/patients/logout', () => {
    it('should return 200 on logout', async () => {
      const response = await request(app)
        .post('/api/patients/logout')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
