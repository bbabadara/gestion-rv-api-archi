import { Router } from 'express';
import { DemandeRvController } from '../controllers/demandeRvController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();
const demandeRvController = new DemandeRvController();

/**
 * Middleware d'authentification pour toutes les routes de DemandeRV
 */
router.use('/demande-rv', authenticate);

/**
 * Routes protégées
 */
router.get('/demande-rv', demandeRvController.getAllDemandes);
router.get('/demande-rv/patient/:patientId', demandeRvController.getDemandesByPatient);
router.get('/demande-rv/:id', demandeRvController.getDemandeById);
router.post('/demande-rv', demandeRvController.createDemande);
router.put('/demande-rv/:id', demandeRvController.updateDemande);
router.delete('/demande-rv/:id', demandeRvController.deleteDemande);

export default router;
