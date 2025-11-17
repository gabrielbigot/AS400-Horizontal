# ⚡ Configuration Rapide des Backends

## 🎯 Prérequis

Vous avez besoin de :
1. ✅ Clé API Supabase (URL + Anon Key)
2. ✅ Clé API Anthropic (pour Claude AI)

---

## 📝 Étape 1 : Créer les fichiers .env

### Backend API

```bash
cd backend
copy .env.example .env
```

Éditez `backend/.env` :
```env
SUPABASE_URL=https://swsyvokuthjvgmezeodv.supabase.co
SUPABASE_ANON_KEY=<VOTRE_CLE_SUPABASE>
PORT=4000
NODE_ENV=development
```

### Backend IA

```bash
cd ai-backend
copy .env.example .env
```

Éditez `ai-backend/.env` :
```env
ANTHROPIC_API_KEY=<VOTRE_CLE_ANTHROPIC>
SUPABASE_URL=https://swsyvokuthjvgmezeodv.supabase.co
SUPABASE_ANON_KEY=<VOTRE_CLE_SUPABASE>
PORT=3001
NODE_ENV=development
```

---

## 🔑 Comment obtenir les clés ?

### Supabase

1. Connectez-vous à https://supabase.com
2. Sélectionnez votre projet (ou créez-en un)
3. Allez dans **Settings** → **API**
4. Copiez :
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`

### Anthropic Claude

1. Connectez-vous à https://console.anthropic.com
2. Allez dans **API Keys**
3. Créez une nouvelle clé ou copiez une clé existante
4. Copiez → `ANTHROPIC_API_KEY`

---

## 🚀 Étape 2 : Démarrer les backends

**Double-cliquez sur :** `start-backends.bat`

Ou en ligne de commande :
```bash
.\start-backends.bat
```

---

## ✅ Étape 3 : Vérifier que ça fonctionne

Ouvrez votre navigateur :

- **Backend API :** http://localhost:4000/api/health
- **Backend IA :** http://localhost:3001/api/health

Vous devriez voir :
```json
{
  "status": "ok",
  "service": "as400-backend",
  "timestamp": "2025-11-06T..."
}
```

---

## 🎉 C'est prêt !

Vos backends sont opérationnels. Vous pouvez maintenant :
1. Démarrer le frontend Next.js : `npm run dev` (port 3000)
2. Accéder à l'application : http://localhost:3000
3. L'assistant IA fonctionnera automatiquement

---

## 🐛 Problèmes courants

### "Port already in use"
Un autre processus utilise déjà le port.

**Solution :**
```bash
# Tuer le processus sur le port 4000
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Tuer le processus sur le port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### "Missing Supabase environment variables"
Le fichier `.env` n'existe pas ou est mal configuré.

**Solution :**
1. Vérifiez que `backend/.env` et `ai-backend/.env` existent
2. Vérifiez que les valeurs sont correctes (pas de guillemets)

### "Invalid API key" (Anthropic)
La clé API Anthropic est incorrecte.

**Solution :**
1. Vérifiez votre clé sur https://console.anthropic.com
2. Copiez la clé complète sans espaces
3. Redémarrez le backend IA

---

## 📞 Besoin d'aide ?

Consultez le [README complet](./BACKEND_README.md) pour plus de détails.
