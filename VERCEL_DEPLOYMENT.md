# 🚀 Guide de Déploiement Backend sur Vercel

Ce guide vous explique comment déployer les deux backends de l'application AS400 sur Vercel.

## 📋 Prérequis

1. Un compte Vercel (gratuit) : [https://vercel.com](https://vercel.com)
2. Le CLI Vercel installé : `npm i -g vercel`
3. Les variables d'environnement configurées

---

## 🏗️ Structure du Projet

Le projet contient deux backends qui seront déployés sur Vercel :

1. **Backend API** (`backend/`) - API REST pour la comptabilité
2. **Backend IA** (`ai-backend/`) - API pour l'assistant IA avec Claude

Les fichiers d'API pour Vercel sont dans le dossier `api/` :
```
api/
├── backend/
│   ├── health.ts          # Health check
│   └── compat/[...path].ts # Routes comptabilité
└── ai/
    └── chat.js            # Endpoint chat IA
```

---

## ⚙️ Configuration

### 1. Variables d'Environnement

Créez un fichier `.env` à la racine du projet ou configurez les variables dans Vercel :

#### Variables pour le Backend API
```env
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_cle_anon_supabase
NODE_ENV=production
```

#### Variables pour le Backend IA
```env
ANTHROPIC_API_KEY=votre_cle_anthropic
# OU
THESYS_API_KEY=votre_cle_thesys

SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_cle_anon_supabase
NODE_ENV=production
```

### 2. Fichier `vercel.json`

Le fichier `vercel.json` à la racine configure les routes :

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.ts",
      "use": "@vercel/node"
    },
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/compat/(.*)",
      "dest": "/api/backend/compat/$1"
    },
    {
      "src": "/api/chat",
      "dest": "/api/ai/chat"
    },
    {
      "src": "/api/health",
      "dest": "/api/backend/health"
    }
  ]
}
```

---

## 🚀 Déploiement

### Option 1 : Déploiement via CLI Vercel (Recommandé)

1. **Installer Vercel CLI** (si pas déjà fait) :
```bash
npm i -g vercel
```

2. **Se connecter à Vercel** :
```bash
vercel login
```

3. **Déployer le projet** :
```bash
# Depuis la racine du projet
vercel
```

4. **Suivre les instructions** :
   - Lier à un projet existant ou créer un nouveau projet
   - Configurer les variables d'environnement (ou les ajouter plus tard dans le dashboard)

5. **Déployer en production** :
```bash
vercel --prod
```

### Option 2 : Déploiement via GitHub

1. **Pousser le code sur GitHub** :
```bash
git add .
git commit -m "Configure Vercel deployment"
git push origin main
```

2. **Connecter le repo à Vercel** :
   - Aller sur [vercel.com](https://vercel.com)
   - Cliquer sur "Add New Project"
   - Importer le repository GitHub
   - Configurer les variables d'environnement dans les paramètres du projet

3. **Vercel déploiera automatiquement** à chaque push sur la branche principale

---

## 🔧 Configuration des Variables d'Environnement dans Vercel

1. Aller sur le dashboard Vercel : [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionner votre projet
3. Aller dans **Settings** → **Environment Variables**
4. Ajouter toutes les variables nécessaires :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY` (ou `THESYS_API_KEY`)
   - `NODE_ENV=production`

---

## 📡 Endpoints Disponibles après Déploiement

Une fois déployé, vos backends seront accessibles via :

### Backend API
- **Health Check** : `https://votre-projet.vercel.app/api/health`
- **Comptes** : `https://votre-projet.vercel.app/api/compat/accounts`
- **Journaux** : `https://votre-projet.vercel.app/api/compat/journals`
- **Écritures** : `https://votre-projet.vercel.app/api/compat/entries`
- **Rapports** : `https://votre-projet.vercel.app/api/compat/reports/balance`

### Backend IA
- **Chat** : `POST https://votre-projet.vercel.app/api/chat`

---

## 🧪 Tester le Déploiement

### Test Health Check
```bash
curl https://votre-projet.vercel.app/api/health
```

### Test Backend API
```bash
# Liste des comptes
curl https://votre-projet.vercel.app/api/compat/accounts

# Liste des journaux
curl https://votre-projet.vercel.app/api/compat/journals
```

### Test Backend IA
```bash
curl -X POST https://votre-projet.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      { "role": "user", "content": "Bonjour, qui es-tu ?" }
    ],
    "user_id": "test-user-id",
    "company_id": "test-company-id"
  }'
```

---

## 🔄 Mise à Jour du Déploiement

### Via CLI
```bash
vercel --prod
```

### Via GitHub
Pousser les changements sur la branche principale déclenchera automatiquement un nouveau déploiement.

---

## 🐛 Dépannage

### Erreur : "Module not found"
- Vérifiez que toutes les dépendances sont dans `package.json`
- Vérifiez que les imports utilisent les chemins corrects

### Erreur : "Environment variable not found"
- Vérifiez que toutes les variables sont configurées dans Vercel
- Redéployez après avoir ajouté les variables

### Erreur : "Function timeout"
- Vercel a une limite de 10 secondes pour les fonctions Hobby (gratuit)
- Pour des fonctions plus longues, passez à un plan payant ou optimisez le code

### Erreur : "Build failed"
- Vérifiez les logs de build dans le dashboard Vercel
- Assurez-vous que TypeScript compile correctement : `npm run build` dans `backend/`

---

## 📝 Notes Importantes

1. **CORS** : Les fonctions Vercel sont configurées pour accepter toutes les origines (`origin: true`). En production, vous pouvez restreindre cela.

2. **Timeouts** :
   - Plan Hobby (gratuit) : 10 secondes max par fonction
   - Plan Pro : 60 secondes max par fonction

3. **Limites de taille** :
   - Corps de requête max : 4.5 MB (Hobby) ou 4.5 MB (Pro)
   - Le backend IA accepte jusqu'à 10 MB

4. **Cold Starts** : Les fonctions serverless peuvent avoir un délai de démarrage ("cold start") lors de la première requête après une période d'inactivité.

---

## 🔐 Sécurité

- ⚠️ **Ne jamais commiter** les fichiers `.env` ou les clés API
- ✅ Utilisez les variables d'environnement Vercel pour les secrets
- ✅ Activez les logs dans Vercel pour le débogage
- ✅ Configurez CORS correctement pour la production

---

## 📚 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Variables d'environnement Vercel](https://vercel.com/docs/environment-variables)

---

## ✅ Checklist de Déploiement

- [ ] Variables d'environnement configurées dans Vercel
- [ ] Fichier `vercel.json` présent à la racine
- [ ] Dossier `api/` avec les fichiers d'API
- [ ] Tests locaux réussis
- [ ] Déploiement réussi
- [ ] Health check fonctionne
- [ ] Endpoints testés
- [ ] CORS configuré correctement
- [ ] Logs vérifiés

---

**Version :** 1.0.0  
**Date :** Novembre 2025




