import request from 'supertest';
import app from '../src/app';
import { DemandeRvService } from '../src/services/demandeRvService';
import { JwtUtils } from '../src/utils/jwtUtils';

jest.mock('../src/services/demandeRvService');
jest.mock('../src/config/database', () => ({
  AppDataSource: {
    isInitialized: true,
    initialize: jest.fn().mockResolvedValue({}),
    getRepository: jest.fn(),
  },
  initializeDatabase: jest.fn().mockResolvedValue(undefined),
}));

describe('DemandeRV Controller', () => {
  let validToken: string;
  let mockDemandeRvService: jest.Mocked<DemandeRvService>;

  beforeAll(() => {
    validToken = JwtUtils.generateToken({ id: 'patient-id', email: 'patient@example.com' });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockDemandeRvService = new DemandeRvService() as jest.Mocked<DemandeRvService>;
  });

  describe('POST /api/demande-rv', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/demande-rv')
        .send({});

      expect(response.status).toBe(401);
    });

    it('should create a demande and return 201', async () => {
      const demandeData = {
        date: '2026-04-15',
        heure: '10:00',
        patientId: 'patient-uuid',
        specialiteId: 'specialite-uuid',
      };

      const mockDemande = {
        id: 'demande-uuid-123',
        numero: 'RV-123',
        date: new Date('2026-04-15'),
        heure: '10:00',
        statutDemande: 'En attente',
        statutRV: 'En cours',
      };

      (DemandeRvService as jest.MockedClass<typeof DemandeRvService>).mockImplementation(() => {
        const service = {
          createDemande: jest.fn().mockResolvedValue(mockDemande),
        } as any;
        return service;
      });

      const response = await request(app)
        .post('/api/demande-rv')
        .set('Authorization', `Bearer ${validToken}`)
        .send(demandeData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('GET /api/demande-rv', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/demande-rv');

      expect(response.status).toBe(401);
    });

    it('should return all demandes with valid token', async () => {
      const mockDemandes = [
        {
          id: 'demande-1',
          numero: 'RV-001',
          date: new Date('2026-04-15'),
          heure: '10:00',
          statutDemande: 'Valider',
          statutRV: 'En cours',
        },
        {
          id: 'demande-2',
          numero: 'RV-002',
          date: new Date('2026-04-16'),
          heure: '14:00',
          statutDemande: 'En attente',
          statutRV: 'En cours',
        },
      ];

      (DemandeRvService as jest.MockedClass<typeof DemandeRvService>).mockImplementation(() => {
        const service = {
          getAllDemandes: jest.fn().mockResolvedValue(mockDemandes),
        } as any;
        return service;
      });

      const response = await request(app)
        .get('/api/demande-rv')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
    });
  });

  describe('GET /api/demande-rv/:id', () => {
    it('should return a specific demande', async () => {
      const mockDemande = {
        id: 'demande-uuid-123',
        numero: 'RV-123',
        date: new Date('2026-04-15'),
        heure: '10:00',
        statutDemande: 'En attente',
        statutRV: 'En cours',
      };

      (DemandeRvService as jest.MockedClass<typeof DemandeRvService>).mockImplementation(() => {
        const service = {
          getDemandeById: jest.fn().mockResolvedValue(mockDemande),
        } as any;
        return service;
      });

      const response = await request(app)
        .get('/api/demande-rv/demande-uuid-123')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('demande-uuid-123');
    });

    it('should return 404 when demande not found', async () => {
      (DemandeRvService as jest.MockedClass<typeof DemandeRvService>).mockImplementation(() => {
        const service = {
          getDemandeById: jest.fn().mockRejectedValue(new Error('Demande non trouvée')),
        } as any;
        return service;
      });

      const response = await request(app)
        .get('/api/demande-rv/invalid-id')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/demande-rv/patient/:patientId', () => {
    it('should return demandes for a specific patient', async () => {
      const mockDemandes = [
        {
          id: 'demande-1',
          numero: 'RV-001',
          patientId: 'patient-uuid',
          statutDemande: 'Valider',
        },
      ];

      (DemandeRvService as jest.MockedClass<typeof DemandeRvService>).mockImplementation(() => {
        const service = {
          getDemandesByPatientId: jest.fn().mockResolvedValue(mockDemandes),
        } as any;
        return service;
      });

      const response = await request(app)
        .get('/api/demande-rv/patient/patient-uuid')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('PUT /api/demande-rv/:id', () => {
    it('should update a demande', async () => {
      const updateData = {
        statutDemande: 'Valider',
        statutRV: 'En cours',
      };

      const mockUpdatedDemande = {
        id: 'demande-uuid-123',
        numero: 'RV-123',
        ...updateData,
      };

      (DemandeRvService as jest.MockedClass<typeof DemandeRvService>).mockImplementation(() => {
        const service = {
          updateDemande: jest.fn().mockResolvedValue(mockUpdatedDemande),
        } as any;
        return service;
      });

      const response = await request(app)
        .put('/api/demande-rv/demande-uuid-123')
        .set('Authorization', `Bearer ${validToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/demande-rv/:id', () => {
    it('should delete a demande', async () => {
      (DemandeRvService as jest.MockedClass<typeof DemandeRvService>).mockImplementation(() => {
        const service = {
          deleteDemande: jest.fn().mockResolvedValue(undefined),
        } as any;
        return service;
      });

      const response = await request(app)
        .delete('/api/demande-rv/demande-uuid-123')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
