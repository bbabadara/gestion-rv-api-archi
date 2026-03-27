# Gestion de Rendez-vous Médical - API

API REST pour la gestion des rendez-vous médicaux développée avec Node.js, Express et TypeScript.

## Table des Matières

- [Description](#description)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Lancement](#lancement)
- [Tests](#tests)
- [CI/CD](#cicd)
- [API Endpoints](#api-endpoints)
- [Gestion des Tags](#gestion-des-tags)

---

## Description

Cette application permet aux patients de :
- Créer un compte et gérer leurs informations personnelles
- Faire des demandes de rendez-vous médicaux
- Consulter et filtrer leurs demandes de rendez-vous par statut
- Consulter leurs rendez-vous validés

---

## Architecture

### Architecture en Couches (MVC + Repository)

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Frontend)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS ROUTER                            │
│  ┌─────────────────┐    ┌─────────────────────────────┐    │
│  │ patientRoutes   │    │   demandeRvRoutes            │    │
│  └─────────────────┘    └─────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     CONTROLLERS                              │
│  ┌─────────────────┐    ┌─────────────────────────────┐    │
│  │PatientController│    │  DemandeRvController        │    │
│  └─────────────────┘    └─────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVICES                                │
│  ┌─────────────────┐    ┌─────────────────────────────┐    │
│  │PatientService   │    │   DemandeRvService         │    │
│  └─────────────────┘    └─────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     REPOSITORIES                             │
│  ┌─────────────────┐    ┌─────────────────────────────┐    │
│  │PatientRepository│    │   DemandeRVRepository      │    │
│  └─────────────────┘    └─────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    TYPEORM / PostgreSQL                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Patient | DemandeRV | Antecedent | Specialite       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Design Patterns Utilisés

| Pattern | Utilisation |
|---------|-------------|
| **Repository** | Isolation de la couche d'accès aux données |
| **MVC** | Séparation des responsabilités (Controller, Service, View/DTO) |
| **Builder** | Construction d'objets complexes (DemandeRV, Patient) |
| **Mapper** | Conversion DTO ↔ Entity |
| **Singleton** | Base de données (AppDataSource) |
| **Factory** | Pattern implicite via TypeORM |

### Principes SOLID Appliqués

- **S**ingle Responsibility : Chaque classe a une responsabilité unique
- **O**pen/Closed : Ouvert à l'extension, fermé à la modification
- **L**iskov Substitution : Les repositories peuvent être remplacés
- **I**nterface Segregation : Interfaces spécifiques (IPatientRepository, IDemandeRVRepository)
- **D**ependency Inversion : Injection via constructeur

---

## Prérequis

- Node.js 20+
- PostgreSQL 14+
- npm ou yarn

---

## Installation

```bash
# Cloner le dépôt
git clone <repository-url>
cd gestion-rv-api

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Modifier .env avec vos paramètres de base de données
```

### Variables d'environnement (.env)

```env
NODE_ENV=development
PORT=3000

# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=rdv_medical

# JWT
JWT_SECRET=votre-secret-tres-securise
JWT_EXPIRES_IN=7d
```

---

## Lancement

```bash
# Mode développement (avec hot-reload)
npm run dev

# Mode production
npm start
```

---

## Tests

### Exécuter les tests

```bash
# Tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Couverture des tests
npm run test:coverage
```

### Structure des Tests

```
tests/
├── patient.test.ts      # Tests du module Patient
└── demandeRv.test.ts     # Tests du module DemandeRV
```

### Outils de Tests

| Outil | Rôle |
|-------|------|
| **Jest** | Framework de test unitaire |
| **Supertest** | Test des endpoints HTTP |

---

## Analyse de Code (ESLint)

```bash
# Lancer ESLint
npm run lint

# Correction automatique
npm run lint:fix
```

### Règles ESLint Configurées

- Variables non utilisées (`no-unused-vars: warn`)
- Erreurs JavaScript basiques (`no-undef: error`)
- Formatage du code (guillemets, point-virgule, indentation)

---

## CI/CD

### Rôle du CI (Intégration Continue)

Le workflow **CI** (`.github/workflows/ci.yml`) s'exécute automatiquement à chaque modification du code :

| Étape | Description |
|-------|-------------|
| Checkout | Récupération du code source |
| Setup Node | Installation de Node.js 20 |
| Dependencies | Installation des dépendances (`npm ci`) |
| Lint | Analyse du code avec ESLint |
| Test | Exécution des tests Jest |

**Déclencheurs :**
- Push sur la branche `main`
- Pull Request vers `main`

**Échec automatique si :**
- Le lint détecte des erreurs
- Un test échoue

### Rôle du CD (Déploiement Continu)

Le workflow **CD** (`.github/workflows/cd.yml`) déclenche le déploiement en production :

| Étape | Description |
|-------|-------------|
| Extract Version | Extraction de la version depuis le tag |
| Setup Node | Installation de Node.js 20 |
| Install | Installation des dépendances |
| Build | Compilation TypeScript |
| Migrate | Exécution des migrations BDD |
| Deploy | Déploiement sur le serveur de production |

**Déclencheur :**
- Création d'un tag Git au format `vX.Y.Z`

### Différence entre Push et Tag

| Concept | Push | Tag |
|---------|------|-----|
| **Nature** | Envoi de commits | Marque une version spécifique |
| **Usage CI** | À chaque commit sur main | Déclenchement du déploiement |
| **Usage CD** | Non utilisé | Signal de déploiement |
| **Exemple** | `git push origin main` | `git tag v1.0.0 && git push origin v1.0.0` |

---

## Gestion des Tags

### Créer un tag

```bash
# Se positionner sur main
git checkout main
git pull origin main

# Créer un tag de version
git tag v1.0.0

# Pousser le tag
git push origin v1.0.0
```

### Format des tags

Le format requis est : `v[0-9]+.[0-9]+.[0-9]+`

| Exemples valides | Exemples invalides |
|------------------|-------------------|
| v1.0.0 | 1.0.0 |
| v2.1.3 | v1.0 |
| v1.0.0-beta | v1.0.0.0 |

### Vérification du Pipeline

Après avoir poussé un tag :

1. **CI ne se déclenche PAS** (uniquement sur push/PR)
2. **CD se déclenche automatiquement** et affiche :

```
============================================
  DEPLOIEMENT DE LA VERSION v1.0.0 EN PRODUCTION
============================================
[SIMULATION] Fichiers déployés sur le serveur de production
[SIMULATION] Deploiement terminé avec succes!
============================================
```

---

## API Endpoints

### Patients

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/patients` | Inscription | Non |
| POST | `/api/patients/login` | Connexion | Non |
| POST | `/api/patients/logout` | Déconnexion | Oui |
| GET | `/api/patients` | Liste des patients | Oui |
| GET | `/api/patients/me` | Profil connecté | Oui |
| GET | `/api/patients/:id` | Détails patient | Oui |
| PUT | `/api/patients/:id` | Modifier patient | Oui |
| DELETE | `/api/patients/:id` | Supprimer patient | Oui |

### Demandes de Rendez-vous

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/demande-rv` | Liste des demandes | Oui |
| GET | `/api/demande-rv/:id` | Détails demande | Oui |
| GET | `/api/demande-rv/patient/:patientId` | Demandes patient | Oui |
| POST | `/api/demande-rv` | Créer demande | Oui |
| PUT | `/api/demande-rv/:id` | Modifier demande | Oui |
| DELETE | `/api/demande-rv/:id` | Supprimer demande | Oui |

### Statuts des Demandes

| Statut Demande | Statut RV |
|----------------|-----------|
| En attente | En cours |
| Valider | Terminer |
| Refuser | Annuler |

---

## Structure du Projet

```
gestion-rv-api/
├── src/
│   ├── config/          # Configuration (DB, env)
│   ├── controllers/     # Contrôleurs HTTP
│   ├── dto/             # Data Transfer Objects
│   ├── entities/       # Entités TypeORM
│   ├── enums/          # Énumérations
│   ├── mapper/         # Convertisseurs DTO ↔ Entity
│   ├── builder/        # Builders
│   ├── middlewares/    # Middlewares Express
│   ├── repositories/  # Couche d'accès aux données
│   ├── routes/         # Définition des routes
│   ├── services/       # Logique métier
│   ├── utils/         # Utilitaires (JWT, password)
│   └── app.ts          # Point d'entrée
├── tests/              # Tests automatisés
├── .github/
│   └── workflows/
│       ├── ci.yml      # Pipeline CI
│       └── cd.yml      # Pipeline CD
├── .env.example
├── .eslintrc.json
├── jest.config.js
├── package.json
├── tsconfig.json
└── README.md
```

---

## Licence

ISC
