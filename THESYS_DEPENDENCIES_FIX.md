# 🔧 Résolution des Dépendances Thesys C1

## Problème rencontré

Erreur : `Module not found: Can't resolve 'eventsource-parser'`

## ✅ Solution appliquée

```bash
npm install eventsource-parser --legacy-peer-deps
```

---

## 📦 Liste complète des dépendances peer Thesys C1

Si vous rencontrez d'autres erreurs de modules manquants, installez-les avec cette commande :

```bash
cd "C:\Users\gabig\Bureau\AS400 alpha\as400-horizontal"

npm install --legacy-peer-deps \
  eventsource-parser \
  tiny-invariant \
  nanoid \
  zustand \
  zod \
  zod-to-json-schema \
  @floating-ui/react-dom \
  @radix-ui/react-dialog
```

### ✅ Installation en une seule commande (recommandé)

Pour éviter les erreurs successives, installez toutes les dépendances d'un coup :

```bash
npm install eventsource-parser tiny-invariant nanoid zustand zod zod-to-json-schema --legacy-peer-deps
```

---

## 🐛 Autres erreurs possibles

### Erreur : "Module not found: Can't resolve 'zod-to-json-schema'"

**Solution** :
```bash
npm install zod-to-json-schema zod --legacy-peer-deps
```

### Erreur : "Module not found: Can't resolve 'nanoid'"

**Solution** :
```bash
npm install nanoid --legacy-peer-deps
```

### Erreur : "Module not found: Can't resolve 'zustand'"

**Solution** :
```bash
npm install zustand --legacy-peer-deps
```

### Erreur : Conflits de versions @radix-ui

**Solution** :
```bash
npm install @radix-ui/react-dialog@^1.1.15 --legacy-peer-deps
```

---

## 🔄 Commande de réinstallation complète

Si vous avez trop d'erreurs, réinstallez tout proprement :

```bash
# Nettoyer
rm -rf node_modules
rm package-lock.json

# Réinstaller
npm install --legacy-peer-deps
```

---

## ✅ Vérification que tout fonctionne

Après installation, vérifiez :

1. **Pas d'erreurs de compilation** :
   ```bash
   npm run dev
   ```

2. **Vérifier les imports dans la console** :
   - Ouvrez http://localhost:3000
   - Console navigateur (F12)
   - Aucune erreur liée à `@thesysai` ou `@crayonai`

3. **Tester un composant C1** :
   - Allez dans l'assistant IA
   - Envoyez un message
   - Vérifiez que la réponse s'affiche

---

## 📊 État actuel des dépendances

### ✅ Installées
- `eventsource-parser` ✅
- `tiny-invariant` ✅
- `zod` ✅
- `zod-to-json-schema` ✅
- `@thesysai/genui-sdk` ✅
- `@crayonai/react-ui` ✅
- `@crayonai/stream` ✅
- `@crayonai/react-core` ✅

### ⏳ Optionnelles (installer si erreur)
- `nanoid`
- `zustand`
- `@floating-ui/react-dom`
- `@radix-ui/react-dialog`

### ⚠️ À surveiller
Si vous voyez d'autres erreurs, référez-vous à la section "Liste complète" ci-dessus.

---

## 🚀 Redémarrer après installation

```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer :
npm run dev
```

---

## 💡 Pourquoi `--legacy-peer-deps` ?

Cette option est nécessaire car :
- Votre projet utilise React 18
- Certains packages Thesys/Crayon ont des peer dependencies sur des versions spécifiques
- `--legacy-peer-deps` ignore les conflits de versions et installe quand même

**C'est sûr ?** Oui, dans ce cas précis, car les packages sont compatibles malgré les avertissements npm.

---

## 📞 Si le problème persiste

1. **Vérifiez votre version de Node.js** :
   ```bash
   node -v
   # Doit être >= 18.0.0
   ```

2. **Vérifiez npm** :
   ```bash
   npm -v
   # Doit être >= 9.0.0
   ```

3. **Nettoyage complet** :
   ```bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install --legacy-peer-deps
   ```

4. **Consultez les logs** :
   ```bash
   npm run dev 2>&1 | tee debug.log
   ```

---

**✅ La dépendance `eventsource-parser` a été installée avec succès.**
**Vous pouvez maintenant relancer `npm run dev` !**
