# 🚀 Guide d'Activation du Serveur Complet avec Thesys C1

## ✅ Ce qui a été créé

J'ai créé **`server_complete.js`** qui inclut :

✅ **Thesys C1** avec OpenAI SDK (UI génératives)
✅ **Fallback Anthropic** (mode texte classique)
✅ **3 Tools comptables** :
- `query_database` - Interroger Supabase
- `analyze_account_balance` - Calculer soldes
- `detect_anomalies` - Détecter anomalies

✅ **Intégration Supabase** complète
✅ **Boucle d'itération** pour exécution des tools
✅ **Gestion automatique** du mode (Thesys vs Anthropic)

---

## 🔄 Comment activer

### Étape 1 : Arrêter le serveur actuel

Dans le terminal backend : **Ctrl+C**

### Étape 2 : Remplacer le serveur

```bash
cd "C:\Users\gabig\Bureau\AS400 alpha\as400-horizontal\ai-backend"

# Sauvegarder l'ancien (au cas où)
ren server.js server_simple.js

# Activer le serveur complet
ren server_complete.js server.js
```

### Étape 3 : Redémarrer

```bash
npm run dev
```

**Vous devriez voir** :
```
🚀 ========================================
🤖 AI Backend server running
📍 Port: 5000
✨ Mode: Thesys C1 (Generative UI) 🎨
🛠️  Tools: query_database, analyze_account_balance, detect_anomalies
🗄️  Database: Supabase connected
========================================
```

---

## 🎯 Fonctionnalités disponibles

### Mode Thesys C1 (si `THESYS_API_KEY` est définie)

1. **UI génératives automatiques**
   - Tableaux pour les listes de données
   - Cartes pour les anomalies
   - Graphiques pour les analyses
   - Boutons d'action contextuels

2. **Tools comptables avec UI**
   - Query database → Affiche en tableau interactif
   - Analyze balance → Affiche avec métriques visuelles
   - Detect anomalies → Affiche en cartes colorées

3. **Boucle d'exécution intelligente**
   - Jusqu'à 10 itérations de tools
   - Exécution automatique des tools demandés
   - Agrégation des résultats

### Mode Anthropic (fallback si pas de `THESYS_API_KEY`)

1. **Réponses textuelles classiques**
2. **Tools comptables fonctionnels**
3. **Même logique métier**

---

## 📊 Exemples de prompts

### Test des tools

```
"Interroge la table journal_entries et montre-moi les 5 dernières écritures"
```
→ Utilise `query_database`

```
"Calcule le solde du compte 411000"
```
→ Utilise `analyze_account_balance`

```
"Détecte les anomalies dans ma comptabilité"
```
→ Utilise `detect_anomalies`

### Tests combinés

```
"Liste les lots déséquilibrés et affiche-les avec des cartes colorées"
```
→ Utilise `detect_anomalies` + UI Thesys

```
"Affiche les écritures du compte 607000 dans un tableau et calcule son solde"
```
→ Utilise `query_database` + `analyze_account_balance`

---

## 🔍 Différences avec la version simple

| Fonctionnalité | Version Simple | Version Complète |
|----------------|----------------|------------------|
| UI Thesys C1 | ✅ | ✅ |
| Tools comptables | ❌ | ✅ |
| Intégration Supabase | ❌ | ✅ |
| Boucle d'itération | ❌ | ✅ |
| Fallback Anthropic | ✅ | ✅ |

---

## 🛠️ Configuration requise

### Variables d'environnement (`ai-backend/.env`)

```bash
# Mode Thesys C1 (recommandé)
THESYS_API_KEY=sk-th-...

# Fallback Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Supabase (pour les tools)
SUPABASE_URL=https://swsyvokuthjvgmezeodv.supabase.co
SUPABASE_ANON_KEY=eyJ...

# Configuration serveur
PORT=5000
NODE_ENV=development
```

---

## ✅ Vérifications

### 1. Backend démarré correctement

```bash
curl http://localhost:5000/api/health
```

**Réponse attendue** :
```json
{
  "status": "ok",
  "service": "as400-ai-backend",
  "timestamp": "2025-11-10T...",
  "version": "2.0.0",
  "mode": "Thesys C1"
}
```

### 2. Tools fonctionnent

Dans les logs backend, vous devriez voir :
```
🔧 Executing tool: query_database
🔧 Executing tool: analyze_account_balance
🔧 Executing tool: detect_anomalies
```

### 3. UI génératives s'affichent

Dans le frontend, les réponses doivent contenir :
- Tableaux interactifs
- Cartes visuelles
- Boutons d'action

---

## 🐛 Dépannage

### Tools ne s'exécutent pas

**Vérifiez** :
- Variables Supabase dans `ai-backend/.env`
- Logs backend pour erreurs
- Format des prompts (demandez explicitement les données)

### UI pas génératives

**Vérifiez** :
- `THESYS_API_KEY` est définie
- Backend redémarré après changement .env
- Logs backend : "Mode: Thesys C1"

### Erreurs de connexion Supabase

**Vérifiez** :
- `SUPABASE_URL` et `SUPABASE_ANON_KEY` corrects
- Connexion internet
- Tables existent dans Supabase

---

## 🔄 Revenir à la version simple

Si besoin :

```bash
cd ai-backend

ren server.js server_complete_backup.js
ren server_simple.js server.js

npm run dev
```

---

## 📝 Changelog

### Version 2.0.0 (Serveur Complet)

✅ Ajout des 3 tools comptables
✅ Intégration Supabase
✅ Boucle d'itération (max 10)
✅ Support OpenAI SDK pour Thesys
✅ Fallback Anthropic automatique
✅ Logs améliorés

### Version 1.0.0 (Serveur Simple)

✅ Support Thesys C1 basique
✅ Réponses simples sans tools

---

## 🎉 Prêt à tester !

1. **Activez** le serveur complet (étapes ci-dessus)
2. **Testez** avec des prompts simples
3. **Testez** avec des prompts utilisant les tools
4. **Observez** les UI génératives Thesys C1 !

**Bonne chance ! 🚀**
