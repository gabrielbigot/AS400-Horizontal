# 🔧 Notes d'intégration Thesys C1

## ⚠️ Problème rencontré

**Erreur** : `404 Cannot POST /v1/embed/v1/messages`

## 🔍 Analyse

Le SDK Anthropic (`@anthropic-ai/sdk`) ajoute automatiquement `/v1/messages` au `baseURL`, ce qui pose problème avec l'API Thesys.

### Architecture URL

```
baseURL: 'https://api.thesys.dev/v1/embed'
    +
SDK Anthropic ajoute: '/v1/messages'
    =
Résultat: 'https://api.thesys.dev/v1/embed/v1/messages' ❌
```

## ✅ Solutions possibles

### Solution 1 : Utiliser OpenAI SDK au lieu d'Anthropic SDK

D'après la documentation Thesys, l'approche recommandée est d'utiliser le SDK OpenAI :

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.THESYS_API_KEY,
  baseURL: 'https://api.thesys.dev/v1/embed',
});

const response = await client.chat.completions.create({
  model: 'c1/anthropic/claude-sonnet-4/v-20250815',
  messages: [...],
  stream: false,
});
```

### Solution 2 : Mode fallback (sans Thesys)

Utiliser uniquement Anthropic direct en commentant `THESYS_API_KEY` :

```bash
# Dans ai-backend/.env
# THESYS_API_KEY=...  # Commenté
ANTHROPIC_API_KEY=sk-ant-...
```

## 🚀 Solution recommandée

**Migrer vers OpenAI SDK pour Thesys C1**

### Étapes

1. Installer OpenAI SDK dans le backend
2. Créer un client conditionnel (Thesys vs Anthropic)
3. Adapter le format des messages
4. Gérer les tools (compatible entre les deux)

### Avantages

- ✅ API Thesys compatible avec OpenAI SDK
- ✅ Fallback vers Anthropic natif possible
- ✅ Même format de tools/functions

## 📝 TODO

- [ ] Installer `openai` dans ai-backend
- [ ] Créer adaptateur pour messages
- [ ] Tester avec Thesys C1
- [ ] Documenter les différences

## 🔗 Références

- Thesys Docs: https://docs.thesys.dev/guides/migrate-to-genui
- OpenAI SDK: https://github.com/openai/openai-node
