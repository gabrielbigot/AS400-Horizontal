# 🚀 Intégration Thesys C1 - Documentation

## 📋 Vue d'ensemble

L'intégration de **Thesys C1** transforme votre assistant IA comptable pour générer des **interfaces utilisateur interactives en temps réel** au lieu de simples réponses textuelles.

### Avantages de Thesys C1

✅ **UI Générative** : Tableaux, graphiques, formulaires générés automatiquement
✅ **Interactivité** : Boutons, actions, flux multi-étapes
✅ **Visualisations** : Données comptables présentées visuellement
✅ **Meilleure UX** : Expérience utilisateur enrichie et intuitive

---

## 🔧 Configuration

### 1️⃣ Obtenir une clé API Thesys

1. Visitez [https://thesys.dev](https://thesys.dev)
2. Créez un compte ou connectez-vous
3. Générez une clé API dans le dashboard
4. Copiez votre clé API

### 2️⃣ Configurer les variables d'environnement

**Backend** (`ai-backend/.env`) :

```bash
# IMPORTANT : Ajoutez votre clé API Thesys
THESYS_API_KEY=your_thesys_api_key_here

# Conservez votre clé Anthropic comme fallback
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Supabase (inchangé)
SUPABASE_URL=https://swsyvokuthjvgmezeodv.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here

PORT=3001
NODE_ENV=development
```

**⚠️ Important** : Si `THESYS_API_KEY` est définie, Thesys C1 sera utilisé automatiquement. Sinon, l'application utilisera directement Anthropic Claude.

---

## 🏗️ Architecture de l'intégration

### Flux de données

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  AIChat Component (ai-chat.tsx)                            │
│  ├─ User Messages: Texte simple                            │
│  └─ Assistant Messages: C1Component                        │
│      ├─ Rendu UI interactive                               │
│      ├─ Tableaux, graphiques, boutons                      │
│      └─ Gestion des actions utilisateur                    │
│                                                             │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTP POST /api/chat
                   ↓
┌─────────────────────────────────────────────────────────────┐
│         Backend Express (ai-backend/server.js)              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Anthropic SDK configuré avec :                            │
│  - baseURL: https://api.thesys.dev/v1/embed                │
│  - model: c1/anthropic/claude-sonnet-4/v-20250815          │
│                                                             │
│  Tools comptables (inchangés) :                            │
│  - query_database                                          │
│  - analyze_account_balance                                 │
│  - detect_anomalies                                        │
│                                                             │
└──────────────────┬──────────────────────────────────────────┘
                   │ API Request
                   ↓
┌─────────────────────────────────────────────────────────────┐
│              Thesys C1 API (Middleware)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Reçoit la requête                                      │
│  2. Appelle Anthropic Claude                               │
│  3. Transforme la réponse texte en DSL UI                  │
│  4. Retourne une UI interactive                            │
│                                                             │
└──────────────────┬──────────────────────────────────────────┘
                   │ Réponse UI (C1 DSL)
                   ↓
┌─────────────────────────────────────────────────────────────┐
│              Anthropic Claude API                           │
│         (Génération de contenu intelligent)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Composants modifiés

### Backend : `ai-backend/server.js`

**Changements** :
1. Import de `transformStream` depuis `@crayonai/stream`
2. Configuration du client Anthropic avec endpoint Thesys
3. Sélection automatique du modèle C1

```javascript
// Avant
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Après
const anthropic = new Anthropic({
  apiKey: process.env.THESYS_API_KEY || process.env.ANTHROPIC_API_KEY,
  baseURL: process.env.THESYS_API_KEY ? 'https://api.thesys.dev/v1/embed' : undefined,
});

// Modèle C1 utilisé automatiquement
const model = process.env.THESYS_API_KEY
  ? 'c1/anthropic/claude-sonnet-4/v-20250815'
  : 'claude-sonnet-4-20250514';
```

### Frontend : `components/ai-assistant/ai-chat.tsx`

**Changements** :
1. Import du SDK Thesys (`@thesysai/genui-sdk`)
2. Utilisation de `C1Component` pour les messages assistant
3. Support du mode dark avec `ThemeProvider`

```tsx
import { C1Component, ThemeProvider } from '@thesysai/genui-sdk'
import '@crayonai/react-ui/styles/index.css'

// Dans le rendu des messages assistant
{message.role === 'assistant' ? (
  <ThemeProvider mode="dark">
    <C1Component
      c1Response={message.content}
      isStreaming={false}
      onAction={({ llmFriendlyMessage }) => {
        console.log('C1 Action:', llmFriendlyMessage)
      }}
    />
  </ThemeProvider>
) : (
  <Response>{message.content}</Response>
)}
```

---

## 📦 Dépendances installées

### Frontend
```json
{
  "@thesysai/genui-sdk": "^0.6.40",
  "@crayonai/react-ui": "latest",
  "@crayonai/stream": "latest",
  "@crayonai/react-core": "latest"
}
```

### Backend
```json
{
  "@crayonai/stream": "latest"
}
```

---

## 🧪 Tests

### 1. Tester sans Thesys (mode fallback)

1. **NE PAS** définir `THESYS_API_KEY` dans `.env`
2. Définir uniquement `ANTHROPIC_API_KEY`
3. Démarrer le backend : `cd ai-backend && npm run dev`
4. L'assistant fonctionnera en mode texte classique

### 2. Tester avec Thesys C1

1. Ajouter `THESYS_API_KEY` dans `ai-backend/.env`
2. Redémarrer le backend
3. Poser une question à l'assistant
4. Observer la réponse sous forme d'UI interactive

### Exemples de prompts pour tester

```
❓ "Montre-moi un tableau des écritures comptables du compte 411000"
❓ "Détecte les anomalies dans ma comptabilité"
❓ "Affiche le solde des comptes clients avec un graphique"
❓ "Liste les lots déséquilibrés sous forme de carte interactive"
```

---

## 🎯 Cas d'usage

### Avant (Texte simple)
```
Assistant: Voici les écritures du compte 411000 :
- Écriture 1 : 1500€ au débit
- Écriture 2 : 800€ au crédit
Solde : 700€
```

### Après (UI interactive avec C1)
```
┌────────────────────────────────────────────────┐
│ 📊 Compte 411000 - Clients                    │
├────────────────────────────────────────────────┤
│                                                │
│  Solde : 700,00 €                             │
│                                                │
│  ┌─────────────┬───────┬────────┬───────────┐ │
│  │ Date        │ Débit │ Crédit │ Libellé   │ │
│  ├─────────────┼───────┼────────┼───────────┤ │
│  │ 10/01/2025  │ 1500€ │    -   │ Facture   │ │
│  │ 15/01/2025  │   -   │  800€  │ Paiement  │ │
│  └─────────────┴───────┴────────┴───────────┘ │
│                                                │
│  [Exporter CSV] [Voir détails] [Lettrer]     │
└────────────────────────────────────────────────┘
```

---

## ⚙️ Configuration avancée

### Personnaliser le système prompt pour C1

Dans `ai-backend/server.js`, vous pouvez enrichir le système prompt :

```javascript
const systemPrompt = `Tu es un assistant comptable expert.

IMPORTANT : Utilise Thesys C1 pour créer des UI interactives :
- Génère des tableaux pour les listes de données
- Crée des graphiques pour les analyses
- Propose des boutons d'action contextuels
- Utilise des cartes pour présenter les anomalies
- Organise les informations de manière visuelle

...
`;
```

### Gérer les actions utilisateur

Les composants C1 peuvent déclencher des actions. Dans `ai-chat.tsx` :

```tsx
<C1Component
  c1Response={message.content}
  onAction={({ llmFriendlyMessage, userFriendlyMessage }) => {
    // llmFriendlyMessage : Message optimisé pour le LLM
    // userFriendlyMessage : Message affiché à l'utilisateur

    // Envoyer la nouvelle requête à l'assistant
    onSendMessage(llmFriendlyMessage)
  }}
/>
```

---

## 🐛 Dépannage

### L'UI interactive ne s'affiche pas

1. Vérifiez que `THESYS_API_KEY` est bien définie
2. Vérifiez les logs du backend pour les erreurs API
3. Assurez-vous que les styles C1 sont importés : `import '@crayonai/react-ui/styles/index.css'`

### Erreurs de dépendances

Si vous rencontrez des conflits de peer dependencies :

```bash
# Frontend
npm install --legacy-peer-deps

# Backend
cd ai-backend
npm install --legacy-peer-deps
```

### Le modèle C1 ne se charge pas

Vérifiez le nom du modèle dans `server.js` :
```javascript
model: 'c1/anthropic/claude-sonnet-4/v-20250815'
```

Consultez la documentation Thesys pour les modèles disponibles : https://docs.thesys.dev

---

## 📚 Ressources

- **Documentation Thesys** : https://docs.thesys.dev
- **API Reference** : https://docs.thesys.dev/api-reference
- **Exemples** : https://github.com/thesysdev/examples
- **Discord** : https://discord.gg/thesys (support communautaire)

---

## 🚀 Prochaines étapes

1. ✅ Obtenir une clé API Thesys
2. ✅ Configurer les variables d'environnement
3. ✅ Démarrer le backend
4. 🔄 Tester avec différents prompts
5. 🎨 Personnaliser l'apparence des composants C1
6. 📊 Enrichir le système prompt pour de meilleures UI

---

**🎉 Félicitations !** Votre assistant IA comptable génère maintenant des interfaces utilisateur interactives grâce à Thesys C1 !
