# 🔐 Guide des Variables d'Environnement

## 📍 Deux fichiers différents, deux rôles différents

### 1️⃣ Frontend : `.env.local` (à la racine)

**Emplacement** : `C:\Users\gabig\Bureau\AS400 alpha\as400-horizontal\.env.local`

**Rôle** : Variables **publiques** accessibles dans le navigateur

**Préfixe obligatoire** : `NEXT_PUBLIC_`

**Contenu** :
```bash
# Supabase (côté client)
NEXT_PUBLIC_SUPABASE_URL=https://swsyvokuthjvgmezeodv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# URL du backend
NEXT_PUBLIC_API_URL=http://localhost:5000
```

⚠️ **NE JAMAIS mettre** :
- ❌ `THESYS_API_KEY`
- ❌ `ANTHROPIC_API_KEY`
- ❌ `OPENAI_API_KEY`
- ❌ Clés secrètes

---

### 2️⃣ Backend : `.env` (dans ai-backend/)

**Emplacement** : `C:\Users\gabig\Bureau\AS400 alpha\as400-horizontal\ai-backend\.env`

**Rôle** : Variables **privées** sécurisées côté serveur

**Pas de préfixe** nécessaire

**Contenu** :
```bash
# Thesys C1 (pour UI génératives)
THESYS_API_KEY=sk-th-...

# Anthropic (fallback)
ANTHROPIC_API_KEY=sk-ant-...

# Supabase (côté serveur)
SUPABASE_URL=https://swsyvokuthjvgmezeodv.supabase.co
SUPABASE_ANON_KEY=eyJ...

# Configuration serveur
PORT=5000
NODE_ENV=development
```

---

## 🔒 Sécurité : Pourquoi deux fichiers ?

### Frontend (.env.local)
- ✅ Variables **exposées** dans le code JavaScript du navigateur
- ✅ Visibles par n'importe qui (F12 → Sources)
- ⚠️ Donc uniquement des infos **non sensibles**
- ✅ Clé Supabase "anon" OK (elle a des restrictions)
- ❌ Clés API secrètes INTERDITES

### Backend (.env)
- ✅ Variables **privées** côté serveur Node.js
- ✅ Jamais envoyées au navigateur
- ✅ Protégées par le serveur
- ✅ Clés API secrètes OK

---

## 📋 Récapitulatif

| Variable | Fichier | Préfixe | Visible navigateur |
|----------|---------|---------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` | ✅ | ✅ Oui |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` | ✅ | ✅ Oui |
| `NEXT_PUBLIC_API_URL` | `.env.local` | ✅ | ✅ Oui |
| `THESYS_API_KEY` | `ai-backend/.env` | ❌ | ❌ Non |
| `ANTHROPIC_API_KEY` | `ai-backend/.env` | ❌ | ❌ Non |
| `SUPABASE_URL` | `ai-backend/.env` | ❌ | ❌ Non |

---

## ⚠️ Erreur courante

### "Missing Supabase environment variables"

**Cause** : Variables dans `.env.local` sans préfixe `NEXT_PUBLIC_`

**Mauvais** ❌ :
```bash
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

**Correct** ✅ :
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## 🔄 Après modification

### Frontend (.env.local)
**Redémarrez le serveur Next.js** :
```bash
# Ctrl+C pour arrêter
npm run dev
```

### Backend (.env)
**Redémarrez le serveur Express** :
```bash
cd ai-backend
# Ctrl+C pour arrêter
npm run dev
```

---

## ✅ Vérification

### Frontend OK ?
Ouvrez la console navigateur (F12) :
```javascript
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
// Doit afficher: https://swsyvokuthjvgmezeodv.supabase.co
```

### Backend OK ?
Dans les logs au démarrage :
```
🤖 Using Thesys C1 (Generative UI)
```

---

## 🎯 Résumé rapide

**FRONTEND** = Variables avec `NEXT_PUBLIC_` → Publiques
**BACKEND** = Variables sans préfixe → Privées et sécurisées

**Clés secrètes** = Toujours dans le **backend uniquement** !

---

**📝 Vos fichiers sont maintenant correctement configurés !**
