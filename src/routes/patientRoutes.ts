import { Router } from 'express';
import { PatientController } from '../controllers/patientController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();
const patientController = new PatientController();

/**
 * Routes publiques
 */
router.post('/patients/login' ,patientController.login);
router.post('/patients', patientController.createPatient);

/**
 * Middleware d'authentification
 */
router.use('/patients', authenticate);

/**
 * Routes protégées
 */
router.get('/patients', patientController.getAllPatients);
router.get('/patients/me', patientController.getProfile);
router.get('/patients/:id', patientController.getPatientById);
router.put('/patients/:id', patientController.updatePatient);
router.delete('/patients/:id', patientController.deletePatient);

export default router;