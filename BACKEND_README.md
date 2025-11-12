# 🚀 Backends AS400 Comptabilité

Ce projet contient **2 serveurs backend** :
1. **Backend API** (TypeScript + Express) - Port 4000
2. **Backend IA** (Node.js + Claude AI) - Port 3001

---

## 📦 Structure

```
as400-horizontal/
├── backend/              # Backend API principal
│   ├── src/
│   │   ├── main.ts       # Point d'entrée
│   │   ├── infra/
│   │   │   └── supabase.ts
│   │   ├── modules/
│   │   │   └── compat/
│   │   │       └── router.ts
│   │   └── shared/
│   │       └── schemas.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
└── ai-backend/           # Backend IA avec Claude
    ├── server.js         # Serveur + Agent IA
    ├── package.json
    └── .env
```

---

## ⚙️ Configuration

### 1. Backend API (Port 4000)

#### Créer le fichier `.env` :
```bash
cd backend
copy .env.example .env
```

#### Éditer `backend/.env` :
```env
SUPABASE_URL=https://swsyvokuthjvgmezeodv.supabase.co
SUPABASE_ANON_KEY=votre_cle_supabase_ici
PORT=4000
NODE_ENV=development
```

### 2. Backend IA (Port 3001)

#### Créer le fichier `.env` :
```bash
cd ai-backend
copy .env.example .env
```

#### Éditer `ai-backend/.env` :
```env
ANTHROPIC_API_KEY=votre_cle_anthropic_ici
SUPABASE_URL=https://swsyvokuthjvgmezeodv.supabase.co
SUPABASE_ANON_KEY=votre_cle_supabase_ici
PORT=3001
NODE_ENV=development
```

---

## 🚀 Démarrage

### Option 1 : Démarrer les 2 backends ensemble

**Windows :**
```bash
# Dans le dossier racine as400-horizontal
.\start-backends.bat
```

**Linux/Mac :**
```bash
chmod +x start-backends.sh
./start-backends.sh
```

### Option 2 : Démarrer séparément

**Backend API :**
```bash
cd backend
npm run dev
```

**Backend IA :**
```bash
cd ai-backend
npm run dev
```

---

## 📡 Endpoints API

### Backend API (http://localhost:4000)

#### Health Check
- **GET** `/api/health`
- Vérifie l'état du serveur

#### Comptes
- **GET** `/api/compat/accounts?page=1&pageSize=50`
- **POST** `/api/compat/accounts` - Body: `{ account_number, label }`

#### Journaux
- **GET** `/api/compat/journals`
- **POST** `/api/compat/journals` - Body: `{ code, name }`

#### Écritures
- **GET** `/api/compat/entries?page=1&pageSize=100&status=draft`
- **POST** `/api/compat/entries` - Body: `[{ compte, s, montant, libelle, date, ... }]`

#### Rapports
- **GET** `/api/compat/reports/balance?startDate=01/09/24&endDate=31/08/25`
- **GET** `/api/compat/reports/grand-livre?compte=411000&startDate=...&endDate=...`
- **GET** `/api/compat/reports/fec?startDate=...&endDate=...`

---

### Backend IA (http://localhost:3001)

#### Health Check
- **GET** `/api/health`

#### Chat avec l'Assistant IA
- **POST** `/api/chat`
- Body:
```json
{
  "messages": [
    { "role": "user", "content": "Analyse ma comptabilité" }
  ],
  "user_id": "uuid",
  "company_id": "uuid"
}
```

- Response:
```json
{
  "success": true,
  "message": "Voici l'analyse...",
  "usage": { "input_tokens": 100, "output_tokens": 200 },
  "iterations": 2
}
```

---

## 🛠️ Outils IA Disponibles

L'assistant IA dispose de 3 outils MCP :

### 1. query_database
Interroge la base de données Supabase.

**Paramètres :**
- `table` : Table à interroger (companies, journals, journal_entries, accounts, etc.)
- `filters` : Filtres à appliquer (ex: `{ "status": "draft" }`)
- `select` : Colonnes à sélectionner (défaut: "*")
- `order` : Tri (ex: "created_at.desc")
- `limit` : Nombre max de résultats

### 2. analyze_account_balance
Calcule le solde d'un compte.

**Paramètres :**
- `account_number` : Numéro de compte (ex: "411000")
- `company_id` : ID de la société (optionnel)
- `status_filter` : all | draft | posted (défaut: "all")

**Retour :**
```json
{
  "debit": 5000.00,
  "credit": 4500.00,
  "balance": 500.00,
  "entry_count": 48
}
```

### 3. detect_anomalies
Détecte les anomalies comptables.

**Paramètres :**
- `company_id` : ID de la société (optionnel)
- `check_types` : Types de vérifications (array)
  - `unbalanced_batches` : Lots déséquilibrés
  - `duplicate_entries` : Doublons
  - `unusual_amounts` : Montants > 10 000€
  - `missing_lettrage` : Écritures non lettrées
  - `old_drafts` : Brouillards > 30 jours

**Retour :**
```json
{
  "anomalies": [
    {
      "type": "unbalanced_batches",
      "severity": "high",
      "description": "Lot déséquilibré",
      "details": { ... }
    }
  ],
  "summary": {
    "total_anomalies": 5,
    "high_severity": 1,
    "medium_severity": 2,
    "low_severity": 2
  }
}
```

---

## 🧪 Tests

### Tester le Backend API
```bash
# Health check
curl http://localhost:4000/api/health

# Liste des comptes
curl http://localhost:4000/api/compat/accounts

# Liste des journaux
curl http://localhost:4000/api/compat/journals
```

### Tester le Backend IA
```bash
# Health check
curl http://localhost:3001/api/health

# Chat (Windows PowerShell)
$body = @{
  messages = @(
    @{ role = "user"; content = "Bonjour, qui es-tu ?" }
  )
} | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3001/api/chat -Method Post -Body $body -ContentType "application/json"
```

---

## 📝 Scripts disponibles

### Backend API
- `npm run dev` : Démarre en mode watch (rechargement auto)
- `npm run build` : Compile TypeScript → JavaScript
- `npm start` : Démarre en production

### Backend IA
- `npm run dev` : Démarre en mode watch
- `npm start` : Démarre en production

---

## 🔒 Sécurité

### Variables d'environnement sensibles
- ⚠️ **Ne jamais commiter** les fichiers `.env`
- ⚠️ Utiliser `.env.example` comme template
- ⚠️ Garder les clés API secrètes

### Supabase RLS
- Toutes les tables ont des politiques Row Level Security
- Authentification requise pour accéder aux données
- Isolation par `user_id`

---

## 🐛 Dépannage

### Port déjà utilisé
```bash
# Windows : Tuer le processus sur le port 4000
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4000 | xargs kill -9
```

### Erreur Supabase
- Vérifier l'URL et la clé dans `.env`
- Vérifier la connexion internet
- Vérifier les migrations SQL

### Erreur Anthropic
- Vérifier la clé API dans `ai-backend/.env`
- Vérifier les quotas API
- Vérifier la connexion internet

---

## 📚 Documentation

- [Backend API - Schemas TypeScript](./backend/src/shared/schemas.ts)
- [Backend API - Routes](./backend/src/modules/compat/router.ts)
- [Backend IA - Agent Claude](./ai-backend/server.js)
- [Documentation Fonctionnelle](./DOCUMENTATION_COMPLETE_FONCTIONNALITES.md)

---

## 🎯 Prochaines étapes

1. ✅ Créer les fichiers `.env` avec les bonnes clés
2. ✅ Démarrer les 2 backends
3. ✅ Tester les endpoints
4. ⏭️ Intégrer le frontend Next.js avec les backends
5. ⏭️ Implémenter les sections fonctionnelles

---

**Version :** 1.0.0
**Auteur :** AS400 Comptabilité Team
**Date :** Novembre 2025
