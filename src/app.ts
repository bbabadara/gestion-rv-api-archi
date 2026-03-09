import express, { Application } from 'express';
import { env } from './config/env';
import { initializeDatabase } from './config/database';
import { errorHandler } from './middlewares/errorHandler';
import patientRoutes from './routes/patientRoutes';
import demandeRvRoutes from './routes/demandeRvRoutes';

const app: Application = express();

// Middlewares globaux
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enregistrement des routes
app.use('/api', patientRoutes);
app.use('/api', demandeRvRoutes);

// Gestionnaire d'erreurs (doit être après toutes les routes)
app.use(errorHandler);

// Fonction de démarrage
const startServer = async () => {
    try {
        // Initialisation de la base de données
        await initializeDatabase();

        // Lancement du serveur
        const port = env.port;
        app.listen(port, () => {
            console.log(`🚀 Serveur démarré en mode ${process.env.NODE_ENV || 'development'}`);
            console.log(`📡 Écoute sur http://localhost:${port}`);
        });
    } catch (error) {
        console.error('❌ Erreur fatale au démarrage:', error);
        process.exit(1);
    }
};

// Démarrer le serveur uniquement s'il n'est pas importé comme module (ex. pour les tests)
if (require.main === module) {
    startServer();
}

export default app;
