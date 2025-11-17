# 🚀 Guide de Démarrage - AS400 Comptabilité Horizontale

## 📋 Ce qui a été créé

### ✅ Structure complète de l'application

Votre nouvelle application est prête ! Elle combine :
- Le style moderne et épuré de **minimal-portfolio**
- Toutes les fonctionnalités de l'**AS400 comptabilité**
- Une **navigation horizontale innovante** : scrollez verticalement pour naviguer horizontalement !

### 🎨 9 Sections Complètes

1. **📊 Dashboard** - Vue d'ensemble avec trésorerie, résultat, alertes
2. **📒 Plan Comptable** - Gestion des comptes avec recherche
3. **📖 Journaux** - AC, VT, BQ, CA, OD
4. **✍️ Écritures** - Formulaire de saisie en partie double
5. **📝 Brouillard** - Validation des lots
6. **🔗 Lettrage** - Rapprochement des écritures
7. **📄 Rapports** - Balance, Grand Livre, FEC, TVA
8. **⚙️ Paramètres** - Configuration exercice et club
9. **🤖 Assistant IA** - Interface de chat avec suggestions

## 🎯 Comment utiliser l'application

### Navigation Horizontale Magique ✨

**Le concept unique :**
- Lorsque vous **scrollez vers le BAS** → vous allez vers la **DROITE**
- Lorsque vous **scrollez vers le HAUT** → vous allez vers la **GAUCHE**

**Trois façons de naviguer :**

1. **Scroll de souris** : La plus intuitive
   - Scroll vers le bas = section suivante (droite)
   - Scroll vers le haut = section précédente (gauche)

2. **Barre latérale gauche** (desktop)
   - Cliquez sur les indicateurs pour accès direct
   - Hover pour voir le nom de la section

3. **Boutons fléchés** (mobile)
   - Boutons en bas de l'écran
   - Navigation tactile

### Démarrer l'application

```bash
# 1. Aller dans le dossier
cd "C:\Users\gabig\Bureau\AS400 alpha\as400-horizontal"

# 2. Installer les dépendances (si pas encore fait)
npm install --legacy-peer-deps

# 3. Lancer le serveur de développement
npm run dev

# 4. Ouvrir dans le navigateur
# http://localhost:3000
```

## 🎨 Design et Animations

### Style Minimal Portfolio

- **Mode sombre par défaut** : Fond noir élégant
- **Typographie soignée** : Police Inter, échelle responsive
- **Glass morphism** : Effets de verre transparent
- **Animations fluides** : Fade-in-up sur chaque section
- **Transitions douces** : 700ms entre les sections

### Palette de Couleurs

```css
Background: #0a0a0a (presque noir)
Foreground: #fafafa (blanc cassé)
Muted: #a1a1a1 (gris moyen)
Border: #262626 (gris foncé)
Primary: #fafafa (blanc)
```

## 🔧 Configuration Supabase (Prochaine étape)

Pour connecter à votre base de données Supabase :

1. **Créer un fichier `.env.local`** à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

2. **Créer les tables dans Supabase** :
   - `companies` : Sociétés
   - `accounts` : Plan comptable
   - `journals` : Journaux
   - `journal_entries` : Écritures
   - `company_settings` : Paramètres

3. **Le schéma SQL complet** sera fourni dans la prochaine phase

## 📱 Responsive Design

### Desktop (>1024px)
- Navigation latérale visible
- Layout large avec max-width
- Hover effects actifs

### Tablet (768px - 1024px)
- Navigation latérale masquée
- Indicateur de section en haut
- Boutons de navigation en bas

### Mobile (<768px)
- Interface optimisée tactile
- Swipe pour naviguer
- Éléments plus larges

## 🎯 Fonctionnalités Actuelles

### ✅ Implémenté (Interface uniquement)

- Navigation horizontale avec scroll
- 9 sections complètes avec design
- Formulaires de saisie
- Tableaux de données
- Animations et transitions
- Thème sombre/clair
- Responsive design

### ⏳ À Implémenter (Fonctionnel)

- Connexion Supabase
- Authentification utilisateur
- CRUD complet (Create, Read, Update, Delete)
- Calculs automatiques
- Validation des données
- Export des rapports
- Assistant IA avec Claude

## 💡 Astuces d'Utilisation

### Navigation

1. **Première utilisation** : Scrollez lentement pour comprendre le concept
2. **Accès rapide** : Utilisez la barre latérale pour sauter aux sections
3. **Mobile** : Les boutons fléchés sont vos amis

### Personnalisation

1. **Couleurs** : Modifiez `app/globals.css` (variables CSS)
2. **Sections** : Éditez les fichiers dans `components/sections/`
3. **Navigation** : Ajoutez/retirez des sections dans `app/page.tsx`

## 🐛 Dépannage

### L'application ne démarre pas

```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules
npm install --legacy-peer-deps
```

### Le scroll ne fonctionne pas

- Vérifiez que vous êtes bien dans la fenêtre de l'application
- Essayez de rafraîchir la page (F5)
- Utilisez les boutons de navigation en bas (mobile)

### Les animations sont saccadées

- Fermez les autres onglets pour libérer des ressources
- Vérifiez que vous êtes en mode développement (pas production)

## 📚 Ressources

### Documentation

- **Next.js** : https://nextjs.org/docs
- **Tailwind CSS** : https://tailwindcss.com/docs
- **Radix UI** : https://www.radix-ui.com/primitives/docs/overview/introduction
- **Supabase** : https://supabase.com/docs

### Fichiers Clés

```
app/page.tsx              → Logique de navigation horizontale
app/globals.css           → Styles et animations
components/sections/      → Toutes les sections de l'app
lib/utils.ts             → Fonctions utilitaires
```

## 🎉 Prochaines Étapes

### Phase 2 : Backend

1. Configuration Supabase
2. Schéma de base de données
3. Authentification
4. API routes Next.js

### Phase 3 : Fonctionnalités Comptables

1. CRUD Plan comptable
2. CRUD Journaux
3. Saisie d'écritures fonctionnelle
4. Validation et lettrage

### Phase 4 : Rapports

1. Génération Balance
2. Grand Livre
3. Export FEC
4. Déclaration TVA

### Phase 5 : IA

1. Intégration Claude AI
2. Détection d'anomalies
3. Chat conversationnel

## 🤝 Besoin d'Aide ?

### Modifications Courantes

**Ajouter une section :**
1. Créer le fichier dans `components/sections/NouvelleSection.tsx`
2. Importer dans `app/page.tsx`
3. Ajouter au tableau `sections`

**Changer les couleurs :**
1. Éditer `app/globals.css`
2. Modifier les variables CSS `:root` et `.dark`

**Modifier une section :**
1. Trouver le fichier dans `components/sections/`
2. Éditer le contenu JSX
3. Sauvegarder (hot reload automatique)

---

**Bravo ! 🎊 Votre application AS400 moderne est prête à être développée !**

Profitez de la navigation horizontale unique et du design épuré.
