# Documentation Architecture - TP CI/CD

## PARTIE 1 : Modélisation

---

## 1.1 Diagramme de Cas d'Utilisation (Use Case)

```mermaid
graph LR
    subgraph "Acteurs"
        P[Patient]
        A[Administrateur]
    end

    subgraph "Cas d'Utilisation"
        PC[Créer un compte]
        CN[Se connecter]
        DF[Se déconnecter]
        MI[Modifier informations]
        
        DR[Faire une demande de RV]
        VR[Voir ses demandes de RV]
        FR[Filtrer par statut]
        SR[Voir ses RV validés]
        
        GG[Gérer les spécialites]
        GD[Gérer les demandes]
        GA[Gérer les antécédents]
    end

    P --> PC
    P --> CN
    P --> DF
    P --> MI
    P --> DR
    P --> VR
    P --> FR
    P --> SR

    A --> GG
    A --> GD
    A --> GA

    PC -.-> CN
    CN -.-> DR
    CN -.-> VR
    CN -.-> FR
    CN -.-> SR
```

### Description des Cas d'Utilisation

| Cas | Description |
|-----|-------------|
| **Créer un compte** | Le patient s'inscrit avec ses informations personnelles |
| **Se connecter** | Le patient s'authentifie avec email/mot de passe |
| **Faire une demande de RV** | Le patient demande un rendez-vous (date, heure, spécialité) |
| **Voir ses demandes** | Le patient consulte la liste de ses demandes |
| **Filtrer par statut** | Le patient filtre ses demandes (En attente, Validé, Refusé) |
| **Voir ses RV** | Le patient voit ses rendez-vous validés |

---

## 1.2 Diagramme de Classes UML

```mermaid
classDiagram
    class Patient {
        +String id
        +String numero
        +String nom
        +String prenom
        +String telephone
        +String email
        +String adresse
        +String motDePasse
        +Antecedent[] antecedents
        +DemandeRV[] demandes
        +createPatient()
        +updatePatient()
        +deletePatient()
        +authenticate()
    }

    class DemandeRV {
        +String id
        +String numero
        +Date date
        +String heure
        +StatutDemande statutDemande
        +StatutRV statutRV
        +Patient patient
        +Specialite specialite
        +create()
        +update()
        +delete()
    }

    class Antecedent {
        +String id
        +String code
        +String nom
        +Patient[] patients
    }

    class Specialite {
        +String id
        +String code
        +String nom
    }

    class StatutDemande {
        <<enumeration>>
        EN_ATTENTE
        VALIDE
        REFUSE
    }

    class StatutRV {
        <<enumeration>>
        EN_COURS
        TERMINE
        ANNULER
    }

    Patient "1" --> "*" DemandeRV : a
    Patient "*" --> "*" Antecedent : possède
    DemandeRV "1" --> "1" Patient : concerne
    DemandeRV "1" --> "1" Specialite : pour
    DemandeRV --> StatutDemande
    DemandeRV --> StatutRV
```

### Cardinalités

| Relation | Cardinalité | Description |
|----------|-------------|-------------|
| Patient → DemandeRV | 1..* | Un patient peut avoir plusieurs demandes |
| DemandeRV → Patient | 1 | Une demande appartient à un patient |
| Patient → Antecedent | *..* | Un patient peut avoir plusieurs antécédents |
| DemandeRV → Specialite | 1 | Une demande concerne une spécialité |

---

## 1.3 Diagrammes d'Activité

### 1.3.1 Cas d'utilisation : Créer un compte

```mermaid
flowchart TD
    A([Début]) --> B{Saisir informations}
    B --> C{Tous les champs requis?}
    C -->|Non| D[Afficher erreur]
    D --> B
    C -->|Oui| E{Email déjà existant?}
    E -->|Oui| F[Afficher erreur]
    F --> B
    E -->|Non| G[Générer numéro patient]
    G --> H[Hashage mot de passe]
    H --> I[Créer patient en BDD]
    I --> J([Fin - Compte créé])
```

### 1.3.2 Cas d'utilisation : Faire une demande de RV

```mermaid
flowchart TD
    A([Début]) --> B{Authentifié?}
    B -->|Non| C[Rediriger vers login]
    C --> D([Fin])
    B -->|Oui| E[Saisir demande]
    E --> F{Date disponible?}
    F -->|Non| G[Afficher créneaux disponibles]
    G --> E
    F -->|Oui| H{Spécialité valide?}
    H -->|Non| I[Afficher erreur]
    I --> E
    H -->|Oui| J[Créer demande]
    J --> K{Confirmer?}
    K -->|Non| E
    K -->|Oui| L[Enregistrer demande]
    L --> M([Fin - Demande créée])
```

### 1.3.3 Cas d'utilisation : Se connecter

```mermaid
flowchart TD
    A([Début]) --> B[Saisir email et mot de passe]
    B --> C{Champs remplis?}
    C -->|Non| D[Afficher erreur]
    D --> B
    C -->|Oui| E{Patient trouvé?}
    E -->|Non| F[Erreur authentification]
    F --> G([Fin - Échec])
    E -->|Oui| H{Mot de passe valide?}
    H -->|Non| F
    H -->|Oui| I[Générer JWT]
    I --> J[Retourner token]
    J --> K([Fin - Succès])
```

### 1.3.4 Cas d'utilisation : Filtrer les demandes par statut

```mermaid
flowchart TD
    A([Début]) --> B[Choisir filtre statut]
    B --> C{Statut valide?}
    C -->|Non| D[Afficher tous]
    D --> E[Afficher demandes]
    C -->|Oui| F[Filtrer par statut]
    F --> E
    E --> G{Afficher détails?}
    G -->|Non| H([Fin])
    G -->|Oui| I[Afficher demande détaillée]
    I --> H
```

---

## 1.4 Maquettes de l'Application

### 1.4.1 Page d'Inscription

```
┌─────────────────────────────────────────┐
│         🏥 Gestion Rendez-vous           │
├─────────────────────────────────────────┤
│                                         │
│     ┌─────────────────────────────┐    │
│     │      Créer un compte         │    │
│     └─────────────────────────────┘    │
│                                         │
│     Nom:     [_______________]          │
│                                         │
│     Prénom:  [_______________]          │
│                                         │
│     Email:   [_______________]          │
│                                         │
│     Tél:     [_______________]          │
│                                         │
│     Mot de passe: [_______________]     │
│                                         │
│     Adresse: [_______________]          │
│                                         │
│     ┌─────────────────────────────┐    │
│     │      S'inscrire              │    │
│     └─────────────────────────────┘    │
│                                         │
│     Déjà un compte? Connexion           │
└─────────────────────────────────────────┘
```

### 1.4.2 Page de Connexion

```
┌─────────────────────────────────────────┐
│         🏥 Gestion Rendez-vous           │
├─────────────────────────────────────────┤
│                                         │
│     ┌─────────────────────────────┐    │
│     │      Connexion               │    │
│     └─────────────────────────────┘    │
│                                         │
│     Email:   [_______________]          │
│                                         │
│     Mot de passe: [_______________]     │
│                                         │
│     ┌─────────────────────────────┐    │
│     │       Se connecter           │    │
│     └─────────────────────────────┘    │
│                                         │
│     Pas de compte? Inscription          │
└─────────────────────────────────────────┘
```

### 1.4.3 Tableau de Bord Patient

```
┌────────────────────────────────────────────────────────────┐
│  🏥 Gestion Rendez-vous         Bienvenue, Jean Dupont  [↩]│
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Mes RV   │ │ Demandes │ │ Profil   │ │ Déconnex.│      │
│  │  En cours│ │  En att. │ │          │ │          │      │
│  │    2     │ │    1     │ │          │ │          │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Filtrer par: [En attente ▼]  [Nouvelle demande] │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │ # │ Date       │ Heure │ Spécialité    │ Statut    │   │
│  ├────────────────────────────────────────────────────┤   │
│  │ 1 │ 15/04/2026 │ 10:00 │ Cardiologie   │ Validé    │   │
│  │ 2 │ 16/04/2026 │ 14:30 │ Générale      │ En attente│   │
│  │ 3 │ 20/04/2026 │ 09:00 │ Dermatologie  │ Validé    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 1.5 Architecture MVC

### 1.5.1 Documentation de l'Architecture MVC

L'architecture **MVC (Model-View-Controller)** sépare l'application en trois couches distinctes :

| Couche | Responsabilité | Exemple |
|--------|---------------|---------|
| **Model** | Données et logique métier | `Patient`, `DemandeRV` |
| **View** | Présentation (DTOs) | `PatientResponseDto` |
| **Controller** | Gestion des requêtes HTTP | `PatientController` |

### 1.5.2 Diagramme de Séquence MVC

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Service
    participant Repository
    participant Database

    Client->>+Controller: POST /api/patients (req.body)
    Controller->>+Service: createPatient(data)
    Service->>+Repository: create(patient)
    Repository->>+Database: INSERT patient
    Database-->>-Repository: patient créé
    Repository-->>-Service: patient
    Service-->>-Controller: patient
    Controller-->>-Client: 201 (response)
```

### 1.5.3 Flux MVC Complet

```mermaid
flowchart LR
    subgraph Request
        HTTP[HTTP Request]
    end

    subgraph Controller
        C[PatientController]
        VA[Validation]
    end

    subgraph Service
        S[PatientService]
        B[Business Logic]
    end

    subgraph Repository
        R[PatientRepository]
    end

    subgraph Model
        DB[(PostgreSQL)]
        E[Entities]
    end

    HTTP --> C
    C --> VA
    VA --> S
    S --> B
    B --> R
    R --> E
    E --> DB
```

---

## 1.6 Pattern Repository

### 1.6.1 Documentation de l'Architecture Repository

Le pattern **Repository** abstrait la couche d'accès aux données :

| Avantage | Description |
|----------|-------------|
| **Découplage** | Le code métier ne connaît pas la source de données |
| **Testabilité** | Facile à mock pour les tests unitaires |
| **Maintenabilité** | Changement de BDD sans impact sur la logique métier |

### 1.6.2 Diagramme de Séquence Repository

```mermaid
sequenceDiagram
    participant Service
    participant Repository
    participant BaseRepository
    participant TypeORM

    Service->>+Repository: findByEmail(email)
    Repository->>+BaseRepository: repository.findOne({where: {email}})
    BaseRepository->>+TypeORM: Query Builder
    TypeORM->>+PostgreSQL: SELECT * FROM patient WHERE email = $1
    PostgreSQL-->>-TypeORM: Result
    TypeORM-->>-BaseRepository: Patient entity
    BaseRepository-->>-Repository: Patient
    Repository-->>-Service: Patient
```

### 1.6.3 Structure du Repository

```mermaid
classDiagram
    class IBaseRepository~T~ {
        <<interface>>
        +findAll(): Promise~T[]~
        +findById(id: string): Promise~T | null~
        +create(entity: T): Promise~T~
        +update(id: string, entity: T): Promise~T~
        +delete(id: string): Promise~void~
        +save(entity: T): Promise~T~
    }

    class BaseRepository~T~ {
        -repository: Repository~T~
        +findAll(): Promise~T[]~
        +findById(id: string): Promise~T | null~
        +create(entity: T): Promise~T~
        +update(id: string, entity: T): Promise~T~
        +delete(id: string): Promise~void~
        +save(entity: T): Promise~T~
    }

    class IPatientRepository {
        <<interface>>
        +findByEmail(email: string): Promise~Patient~
        +findByIdWithRelations(id: string): Promise~Patient~
        +addAntecedent(patientId: string, antecedentId: string): Promise~Patient~
    }

    class PatientRepository {
        +findByEmail(email: string): Promise~Patient~
        +findByIdWithRelations(id: string, relations: string[]): Promise~Patient~
        +addAntecedent(patientId: string, antecedentId: string): Promise~Patient~
    }

    IBaseRepository <|.. BaseRepository
    IBaseRepository <|-- IPatientRepository
    BaseRepository <|-- PatientRepository
    IPatientRepository <|.. PatientRepository
```

---

## 1.7 Schéma d'Architecture Globale (API REST)

```mermaid
flowchart TB
    subgraph Client
        Browser[🌐 Navigateur]
        Mobile[📱 Application Mobile]
        Postman[🔧 Postman/API Client]
    end

    subgraph API_Gateway
        Express[⚡ Express Router]
        Auth[🔐 Middleware Auth]
        Error[⚠️ Error Handler]
    end

    subgraph Controllers
        PC[👤 PatientController]
        DC[📅 DemandeRvController]
    end

    subgraph Services
        PS[👤 PatientService]
        DS[📅 DemandeRvService]
    end

    subgraph Repositories
        PR[👤 PatientRepository]
        DR[📅 DemandeRVRepository]
        BR[🔧 BaseRepository]
    end

    subgraph Data_Access
        ORM[📊 TypeORM]
        Migrations[🔄 Migrations]
    end

    subgraph Database
        PG[(🗄️ PostgreSQL)]
    end

    Client --> API_Gateway
    Browser --> Express
    Mobile --> Express
    Postman --> Express

    Express --> Auth
    Auth --> PC
    Auth --> DC
    Auth --> Error

    PC --> PS
    DC --> DS

    PS --> PR
    DS --> DR

    PR --> BR
    DR --> BR

    PR --> ORM
    DR --> ORM

    ORM --> Migrations
    Migrations --> PG

    style Client fill:#e1f5fe
    style Database fill:#c8e6c9
    style API_Gateway fill:#fff3e0
```

### Architecture API REST - Ressources

```mermaid
erDiagram
    PATIENT {
        uuid id PK
        string numero UK
        string nom
        string prenom
        string telephone
        string email UK
        string adresse
        string motDePasse
    }

    DEMANDE_RV {
        uuid id PK
        string numero UK
        date date
        string heure
        uuid patientId FK
        uuid specialiteId FK
        enum statutDemande
        enum statutRV
    }

    SPECIALITE {
        uuid id PK
        string code
        string nom
    }

    ANTECEDENT {
        uuid id PK
        string code
        string nom
    }

    PATIENT ||--o{ DEMANDE_RV : "a"
    DEMANDE_RV }o--|| SPECIALITE : "pour"
    PATIENT }o--o{ ANTECEDENT : "possède"
```

---

## 1.8 Principes SOLID et Design Patterns

### 1.8.1 Principes SOLID Appliqués

| Principe | Application dans le projet |
|----------|---------------------------|
| **S**ingle Responsibility | `PatientController` uniquement pour HTTP, `PatientService` pour la logique métier |
| **O**pen/Closed | Les repositories peuvent être étendus sans modification du service |
| **L**iskov Substitution | `PatientRepository` peut remplacer `IPatientRepository` |
| **I**nterface Segregation | Interfaces spécifiques par entité (`IPatientRepository`, `IDemandeRVRepository`) |
| **D**ependency Inversion | Les services dépendent des interfaces, pas des implémentations |

### 1.8.2 Design Patterns Utilisés

#### Pattern Repository

**Problème résolu :** Comment accéder aux données sans coupler le code métier à la base de données ?

```mermaid
flowchart LR
    subgraph Without
        S1[Service] --> SQL[SQL Queries]
    end

    subgraph With
        S2[Service] --> R[Repository Interface]
        R --> PR[PostgreSQL Repository]
        R --> MR[MongoDB Repository]
    end
```

#### Pattern Builder

**Problème résolu :** Comment créer des objets complexes avec de nombreux paramètres ?

```mermaid
classDiagram
    class DemandeRVBuilder {
        -demande: DemandeRV
        +setDate(date: Date): DemandeRVBuilder
        +setHeure(heure: string): DemandeRVBuilder
        +setPatient(patient: Patient): DemandeRVBuilder
        +setSpecialite(specialite: Specialite): DemandeRVBuilder
        +build(): DemandeRV
    }

    class DemandeRVMapper {
        +toEntity(dto: CreateDemandeRVDto): DemandeRV
        +toDto(entity: DemandeRV): DemandeRVResponseDto
        +updateEntity(entity: DemandeRV, dto: UpdateDemandeRVDto): DemandeRV
    }

    DemandeRVBuilder --> DemandeRV
    DemandeRVMapper --> DemandeRV
```

**Exemple d'utilisation :**

```typescript
// Sans Builder
const demande = new DemandeRV();
demande.date = new Date();
demande.heure = '10:00';
demande.patient = patient;
demande.specialite = specialite;

// Avec Builder
const demande = new DemandeRVBuilder()
  .setDate(new Date())
  .setHeure('10:00')
  .setPatient(patient)
  .setSpecialite(specialite)
  .build();
```

#### Pattern Mapper

**Problème résolu :** Comment convertir entre DTO et Entity sans polluer le code ?

```mermaid
flowchart LR
    subgraph DTOs
        CPD[CreatePatientDto]
        UPD[UpdatePatientDto]
        RPD[PatientResponseDto]
    end

    subgraph Mappers
        PM[PatientMapper]
    end

    subgraph Entities
        E[Patient]
    end

    CPD --> PM
    UPD --> PM
    PM --> RPD
    PM --> E
    E --> PM
```

#### Pattern Singleton (Base de données)

**Problème résolu :** Comment s'assurer qu'une seule connexion à la base de données est créée ?

```typescript
// BaseRepository.ts
export class BaseRepository<T> {
  protected repository: Repository<T>; // Unique instance par entité

  constructor(entityClass: any) {
    // AppDataSource.getRepository() retourne toujours la même instance
    this.repository = AppDataSource.getRepository<T>(entityClass);
  }
}
```

### 1.8.3 Diagramme de Séquence - Design Patterns

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Service
    participant Mapper
    participant Builder
    participant Repository
    participant DB

    Client->>+Controller: POST /demande-rv
    Controller->>+Service: createDemande(dto)
    Service->>+Mapper: toEntity(dto)
    Mapper->>+Builder: DemandeRVBuilder
    Builder-->>-Mapper: DemandeRV
    Mapper-->>-Service: DemandeRV
    Service->>+Repository: create(demande)
    Repository->>+DB: INSERT
    DB-->>-Repository: Result
    Repository-->>-Service: DemandeRV
    Service-->>+Mapper: toResponseDto(demande)
    Mapper-->>-Service: DemandeRVResponseDto
    Service-->>-Controller: response
    Controller-->>-Client: 201
```

---

## 1.9 Architecture Monolithique

### Pourquoi une Architecture Monolithique ?

| Critère | Choix |
|---------|-------|
| **Complexité** | Projet de taille moyenne, pas besoin de microservices |
| **Déploiement** | Un seul artefact à déployer |
| **Performance** | Pas de latence réseau inter-services |
| **Coût** | Infrastructure simple et économique |

### Avantages

- ✅ Développement simple
- ✅ Déploiement uncomplicated
- ✅ Tests facilités (pas de mocks inter-services)
- ✅ Performance optimale pour les opérations ACID
- ✅ Équipe réduite

### Inconvénients

- ❌ Difficulté à faire évoluer (code spaghetti)
- ❌ Déploiement atomique (tout redéployer)
- ❌ Scaling vertical uniquement
- ❌ Couplage fort entre modules

### Alternative Future

Pour une application à plus grande échelle :

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Gateway    │────▶│  Patient    │────▶│  PostgreSQL │
│   API       │     │   Service   │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  DemandeRV  │────▶│  PostgreSQL │
                    │   Service   │     │             │
                    └─────────────┘     └─────────────┘
```

---

## 1.10 Résumé de l'Architecture

```mermaid
mindmap
    root((Architecture))
        Modélisation
            Use Case
            Diagramme Classes
            Diagrammes Activité
            Maquettes
        Style Architecture
            MVC
                Controller
                Service
                Repository
            Repository Pattern
                IBaseRepository
                PatientRepository
            API REST
                Endpoints
                HTTP Methods
        Modèle Architecture
            Monolithique
            Principes SOLID
            Design Patterns
                Builder
                Mapper
                Singleton
        Schéma Global
            Client
            Express
            TypeORM
            PostgreSQL
```
