import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'rdv_medical',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [__dirname+"/../entities/*.ts"],
  migrations: ['dist/migrations/*.js'],
  subscribers: [],
  
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✅ Base de données connectée avec succès');
    }
  } catch (error: any) {
    console.error('❌ Erreur de connexion à la base de données');
    
    if (error.code === '28P01') {
      console.error('🔐 Erreur d\'authentification PostgreSQL');
      console.error('   Vérifiez vos identifiants dans le fichier .env :');
      console.error(`   - DB_USERNAME: ${process.env.DB_USERNAME || 'postgres'}`);
      console.error(`   - DB_PASSWORD: ${process.env.DB_PASSWORD ? '***' : 'non défini'}`);
      console.error(`   - DB_HOST: ${process.env.DB_HOST || 'localhost'}`);
      console.error(`   - DB_PORT: ${process.env.DB_PORT || '5432'}`);
      console.error(`   - DB_NAME: ${process.env.DB_NAME || 'rdv_medical'}`);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Impossible de se connecter au serveur PostgreSQL');
      console.error('   Vérifiez que PostgreSQL est démarré et accessible');
    } else {
      console.error('   Détails:', error.message);
    }
    
    process.exit(1);
  }
};