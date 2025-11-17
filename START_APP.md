# 🚀 Comment démarrer l'application complète

## ⚠️ Important : 2 serveurs nécessaires

Pour que l'application fonctionne, vous devez démarrer **2 serveurs en parallèle** :

1. **Backend** (Express.js sur port 3001 ou 5000)
2. **Frontend** (Next.js sur port 3000)

---

## 📋 Instructions de démarrage

### Option 1 : Deux terminaux séparés (RECOMMANDÉ)

**Terminal 1 - Backend** :
```bash
cd "C:\Users\gabig\Bureau\AS400 alpha\as400-horizontal\ai-backend"
npm run dev
```

**Attendez de voir** :
```
🤖 AI Backend server running on http://localhost:3001
📊 Health check: http://localhost:3001/api/health
💬 Chat endpoint: POST http://localhost:3001/api/chat
```

**Terminal 2 - Frontend** :
```bash
cd "C:\Users\gabig\Bureau\AS400 alpha\as400-horizontal"
npm run dev
```

**Attendez de voir** :
```
✓ Ready in 3.2s
○ Local: http://localhost:3000
```

---

### Option 2 : Script de démarrage automatique (Windows)

Créez un fichier `start-app.bat` :

```batch
@echo off
echo Starting AS400 Application...

echo.
echo [1/2] Starting Backend...
start cmd /k "cd ai-backend && npm run dev"

timeout /t 5 /nobreak

echo.
echo [2/2] Starting Frontend...
start cmd /k "npm run dev"

echo.
echo Application starting...
echo Backend will be on http://localhost:3001
echo Frontend will be on http://localhost:3000
pause
```

Double-cliquez sur `start-app.bat` pour tout démarrer.

---

## ✅ Vérification que tout fonctionne

### 1. Backend démarré ?

Ouvrez dans votre navigateur : **http://localhost:3001/api/health**

Vous devez voir :
```json
{
  "status": "ok",
  "service": "as400-ai-backend",
  "timestamp": "2025-11-10T...",
  "version": "1.0.0"
}
```

### 2. Frontend démarré ?

Ouvrez dans votre navigateur : **http://localhost:3000**

Vous devez voir la page d'accueil de votre application.

---

## 🐛 Résolution des problèmes

### ❌ Backend : "Port 3001 is already in use"

**Solution** :
```bash
# Changer le port dans ai-backend/.env
PORT=5000

# Puis dans le frontend, créer/éditer .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### ❌ Frontend : "Failed to fetch"

**Cause** : Le backend n'est pas démarré.

**Solution** :
1. Vérifiez que le backend tourne (terminal 1)
2. Testez http://localhost:3001/api/health
3. Si rien ne s'affiche, démarrez le backend

### ❌ Backend : "ANTHROPIC_API_KEY is not set"

**Solution** :
```bash
# Dans ai-backend/.env, ajoutez :
ANTHROPIC_API_KEY=sk-ant-xxxxx
# OU
THESYS_API_KEY=thesys_xxxxx
```

---

## 🔧 Configuration des URLs

### Backend (ai-backend/.env)

```bash
PORT=3001
NODE_ENV=development
THESYS_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
SUPABASE_URL=https://swsyvokuthjvgmezeodv.supabase.co
SUPABASE_ANON_KEY=your_key_here
```

### Frontend (.env.local)

Créez ce fichier à la racine si besoin :

```bash
# URL du backend
NEXT_PUBLIC_API_URL=http://localhost:3001

# Ou si vous avez changé le port backend :
# NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 📊 Ordre de démarrage recommandé

1. ✅ **D'abord le Backend** (ai-backend)
   - Attend 3-5 secondes qu'il soit prêt

2. ✅ **Ensuite le Frontend** (racine)
   - Il se connectera automatiquement au backend

---

## 🚀 Commandes rapides

```bash
# Backend seul
cd ai-backend && npm run dev

# Frontend seul
npm run dev

# Tout arrêter
# Appuyez sur Ctrl+C dans chaque terminal
```

---

## ✅ Checklist de démarrage

- [ ] Backend démarré (terminal 1)
- [ ] Message "AI Backend server running" visible
- [ ] http://localhost:3001/api/health répond OK
- [ ] Frontend démarré (terminal 2)
- [ ] http://localhost:3000 accessible
- [ ] Aucune erreur "Failed to fetch" dans la console

**🎉 Si tous les points sont cochés, l'application est prête !**

---

## 💡 Astuce

Pour éviter de devoir redémarrer à chaque modification :

- Le **backend** redémarre automatiquement avec `npm run dev` (nodemon)
- Le **frontend** recharge automatiquement (Next.js Hot Reload)

Vous n'avez besoin de redémarrer manuellement **que si** :
- Vous modifiez les fichiers `.env`
- Vous installez de nouvelles dépendances npm
- Vous rencontrez des erreurs bizarres (redémarrage = reset)
