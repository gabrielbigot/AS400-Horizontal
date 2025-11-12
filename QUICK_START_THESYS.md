# ⚡ Guide de Démarrage Rapide - Thesys C1

## 🎯 En 5 minutes, activez les UI interactives !

### Étape 1 : Obtenir votre clé API Thesys

1. Rendez-vous sur **https://thesys.dev**
2. Créez un compte gratuit
3. Accédez au **Dashboard** → **API Keys**
4. Cliquez sur **"Generate New API Key"**
5. Copiez votre clé (format : `thesys_xxxxxxxxxxxxx`)

---

### Étape 2 : Configurer le Backend

1. Ouvrez le fichier **`ai-backend/.env`**
2. Ajoutez votre clé API :

```bash
THESYS_API_KEY=thesys_votre_cle_api_ici
```

3. **Important** : Conservez aussi votre clé Anthropic comme fallback :

```bash
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

---

### Étape 3 : Démarrer l'application

**Terminal 1 - Backend :**
```bash
cd ai-backend
npm run dev
```

Vous devriez voir :
```
🤖 AI Backend server running on http://localhost:3001
✅ Using Thesys C1 API for generative UI
```

**Terminal 2 - Frontend :**
```bash
npm run dev
```

Ouvrez **http://localhost:3000** dans votre navigateur.

---

### Étape 4 : Tester l'UI interactive

Allez dans la section **Assistant IA** et testez ces prompts :

#### 📊 Test 1 : Tableau interactif
```
Montre-moi les 5 dernières écritures comptables sous forme de tableau
```

**Résultat attendu** : Un tableau interactif au lieu d'une liste texte

---

#### 🔍 Test 2 : Détection d'anomalies avec cartes
```
Détecte les anomalies dans ma comptabilité et affiche-les avec des cartes visuelles
```

**Résultat attendu** : Des cartes colorées selon la sévérité (rouge, orange, jaune)

---

#### 💰 Test 3 : Analyse de compte avec graphique
```
Analyse le compte 411000 et montre-moi un graphique de l'évolution
```

**Résultat attendu** : Graphique + tableau + boutons d'action

---

### Étape 5 : Vérifier que C1 fonctionne

#### ✅ Indicateurs de succès :

1. **Dans les logs backend** :
   ```
   ✅ Using Thesys C1 API
   Model: c1/anthropic/claude-sonnet-4/v-20250815
   ```

2. **Dans le frontend** :
   - Les réponses de l'assistant contiennent des éléments visuels (tableaux, boutons)
   - Les composants sont interactifs (hover, clic)
   - Le style est différent du texte simple

3. **Dans la console navigateur** :
   - Aucune erreur liée à `@thesysai/genui-sdk`
   - Les styles C1 sont chargés

---

## 🐛 Problèmes courants

### ❌ "API Key invalid"

**Solution** :
- Vérifiez que vous avez copié la clé complète
- Assurez-vous qu'il n'y a pas d'espace avant/après
- Régénérez une nouvelle clé sur le dashboard Thesys

---

### ❌ L'UI n'est pas interactive

**Vérifications** :

1. **Backend utilise bien Thesys** :
   ```bash
   # Dans ai-backend/.env
   THESYS_API_KEY=thesys_xxxxx  # Doit être définie
   ```

2. **Redémarrer le backend** :
   ```bash
   cd ai-backend
   # Ctrl+C pour arrêter
   npm run dev
   ```

3. **Vérifier les imports frontend** :
   ```tsx
   // Dans ai-chat.tsx
   import { C1Component, ThemeProvider } from '@thesysai/genui-sdk'
   import '@crayonai/react-ui/styles/index.css'  // Important !
   ```

---

### ❌ Erreur "Module not found: Can't resolve '...'"

**Solutions selon le module manquant** :

```bash
# eventsource-parser
npm install eventsource-parser --legacy-peer-deps

# zod-to-json-schema
npm install zod-to-json-schema zod --legacy-peer-deps

# Installer TOUS les modules d'un coup (RECOMMANDÉ) :
npm install eventsource-parser tiny-invariant nanoid zustand zod zod-to-json-schema --legacy-peer-deps
```

Voir `THESYS_DEPENDENCIES_FIX.md` pour plus de détails.

---

### ❌ Erreurs de dépendances générales

**Solution** :
```bash
# Frontend
npm install --legacy-peer-deps

# Backend
cd ai-backend
npm install --legacy-peer-deps
```

---

## 🎨 Personnalisation

### Changer le thème des composants C1

Dans `ai-chat.tsx` :

```tsx
<ThemeProvider mode="dark">  {/* ou "light" */}
  <C1Component {...props} />
</ThemeProvider>
```

### Adapter le système prompt

Dans `ai-backend/server.js`, modifiez le `systemPrompt` :

```javascript
const systemPrompt = `Tu es un assistant comptable expert.

INSTRUCTIONS POUR UI GÉNÉRATIVES :
- Présente TOUJOURS les données sous forme de tableaux interactifs
- Utilise des graphiques pour les analyses temporelles
- Crée des boutons d'action pour les opérations courantes
- Organise les anomalies par cartes avec code couleur (🔴 high, 🟡 medium, 🟢 low)
- Propose des filtres et options de tri

...
`;
```

---

## 📊 Exemples de prompts avancés

### Tableaux avec actions
```
Liste les lots déséquilibrés avec un bouton pour corriger chacun
```

### Formulaires interactifs
```
Crée un formulaire pour saisir une nouvelle écriture comptable
```

### Flux multi-étapes
```
Guide-moi pour faire le lettrage du compte 411000 étape par étape
```

### Visualisations comparatives
```
Compare les soldes des comptes clients vs fournisseurs sur un graphique
```

---

## 🚀 Aller plus loin

### 1. Actions personnalisées

Gérez les clics utilisateur dans `ai-chat.tsx` :

```tsx
<C1Component
  c1Response={message.content}
  onAction={({ llmFriendlyMessage, userFriendlyMessage, payload }) => {
    console.log('Action déclenchée:', payload)

    // Relancer une requête avec le contexte
    onSendMessage(llmFriendlyMessage)
  }}
/>
```

### 2. Composants personnalisés

Créez vos propres composants réutilisables :

```tsx
import { C1Chat } from '@thesysai/genui-sdk'

<C1Chat
  apiUrl="/api/chat"
  customizeC1={{
    responseFooterComponent: CustomFooter,
  }}
/>
```

### 3. Streaming en temps réel

Activez le streaming pour voir l'UI se construire :

```tsx
<C1Component
  c1Response={streamingContent}
  isStreaming={true}  // Active l'animation de construction
/>
```

---

## 📞 Support

- **Documentation** : https://docs.thesys.dev
- **Exemples** : https://github.com/thesysdev/examples
- **Community Discord** : https://discord.gg/thesys
- **Email support** : support@thesys.dev

---

## ✅ Checklist de démarrage

- [ ] Clé API Thesys obtenue
- [ ] Variable `THESYS_API_KEY` configurée dans `ai-backend/.env`
- [ ] Backend redémarré
- [ ] Frontend redémarré
- [ ] Premier test avec un prompt simple réussi
- [ ] UI interactive visible
- [ ] Actions de clic fonctionnelles

**🎉 Bravo !** Votre assistant IA comptable génère maintenant des interfaces utilisateur interactives !

---

## 🔄 Revenir au mode texte classique

Si vous souhaitez désactiver temporairement Thesys C1 :

1. Commentez la ligne dans `ai-backend/.env` :
   ```bash
   # THESYS_API_KEY=thesys_xxxxx
   ```

2. Redémarrez le backend

L'application utilisera alors directement Anthropic Claude en mode texte.
