# AS400 Horizontal - Application de Comptabilité Moderne

## 🎯 Présentation

**AS400 Horizontal** est une application de comptabilité moderne et innovante conçue pour le **TAC Hockey Club**. Elle offre une expérience utilisateur unique avec une navigation horizontale via scroll vertical, permettant une gestion complète de la comptabilité d'association sportive.

### ✨ Caractéristiques Principales

- 🎨 **Interface Moderne** : Design épuré avec glass morphism et dark mode
- 🔄 **Navigation Innovante** : Défilement horizontal via scroll vertical pour une navigation fluide
- 🤖 **Intelligence Artificielle** : Assistant IA intégré avec Claude AI pour aide contextuelle
- 📊 **Visualisations Riches** : Graphiques interactifs avec Recharts
- ⚡ **Performance Optimale** : Virtual scrolling, loading skeletons, animations GPU
- ⌨️ **Raccourcis Clavier** : Navigation et actions rapides via shortcuts
- 🎯 **Command Palette** : Recherche et navigation rapide (Ctrl+K)
- 📱 **Responsive** : Adapté desktop et mobile

---

## 🏗️ Architecture

### Stack Technologique

**Frontend:**
- Next.js 15.2.4 (App Router)
- React 18.3.1
- TypeScript 5.x
- Tailwind CSS 4.1.9

**UI/UX:**
- Radix UI (composants accessibles)
- Recharts (graphiques)
- Framer Motion (animations)
- Lucide React (icônes)
- @tanstack/react-virtual (performance)

**Backend:**
- Supabase (PostgreSQL)
- Express.js (API REST)
- Anthropic Claude AI

**Visualisation:**
- Three.js + React Three Fiber (3D)
- jsPDF (export PDF)

### Structure du Projet

```
as400-horizontal/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Navigation principale
│   ├── layout.tsx               # Layout racine
│   └── globals.css              # Styles globaux
├── components/
│   ├── sections/                # 9 sections de l'application
│   │   ├── DashboardSection.tsx
│   │   ├── PlanComptableSection.tsx
│   │   ├── JournauxSection.tsx
│   │   ├── EcrituresSection.tsx
│   │   ├── BrouillardSection.tsx
│   │   ├── LettrageSection.tsx
│   │   ├── RapportsSection.tsx
│   │   ├── ParametresSection.tsx
│   │   └── AssistantSection.tsx
│   ├── ai-assistant/            # Composants IA
│   └── ui/                      # Composants réutilisables
├── hooks/                       # Custom React hooks
├── lib/                         # Utilitaires
│   ├── supabase.ts             # Client Supabase
│   ├── api.ts                  # Appels API
│   └── utils.ts                # Fonctions utilitaires
├── backend/                     # API Express.js
└── ai-backend/                  # Service Claude AI
```

---

## 🚀 Installation & Démarrage

### Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase
- Clé API Anthropic (pour l'assistant IA)

### Installation

```bash
# Cloner le projet
cd as400-horizontal

# Installer les dépendances
npm install

# Configurer les variables d'environnement
# Créer .env.local avec :
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_supabase
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Démarrage

**Option 1 - Script automatique (Windows):**
```batch
lancer-as400.bat
```

**Option 2 - Manuel (3 terminaux):**

Terminal 1 - Frontend:
```bash
cd as400-horizontal
npm run dev
# http://localhost:3000
```

Terminal 2 - Backend API:
```bash
cd as400-horizontal/backend
npm run dev
# http://localhost:4000
```

Terminal 3 - AI Backend:
```bash
cd as400-horizontal/ai-backend
node server.js
# http://localhost:5000
```

---

## 📚 Les 9 Sections de l'Application

### 1. 📊 Tableau de Bord
Vue d'ensemble de la comptabilité avec :
- Indicateurs financiers (trésorerie, résultat, produits, charges)
- Graphiques d'évolution sur 6 mois
- Répartition des charges par catégorie
- Top 5 des comptes les plus actifs
- Statistiques d'activité

### 2. 📖 Plan Comptable
Gestion des comptes comptables :
- Liste de tous les comptes (avec virtual scrolling)
- Recherche par numéro ou libellé
- Création/modification/suppression de comptes
- Visualisation des écritures par compte
- Types : ACTIF, PASSIF, CHARGE, PRODUIT

### 3. 📔 Journaux
Configuration des journaux comptables :
- 5 types : ACHAT (AC), VENTE (VT), BANQUE (BQ), CAISSE (CA), OPERATIONS DIVERSES (OD)
- Création et gestion des journaux
- Association avec les écritures

### 4. ✍️ Écritures
Saisie d'opérations comptables :
- Principe de la partie double (Débit/Crédit)
- Validation d'équilibre automatique
- Sélection de compte avec autocomplétion
- Enregistrement par lot (batch)
- Statut : draft (brouillard) ou posted (validé)

### 5. 📝 Brouillard
Validation d'écritures en attente :
- Liste des écritures en mode draft
- Validation individuelle ou par lot
- Vérification de l'équilibre
- Passage en statut posted

### 6. 🔗 Lettrage
Rapprochement d'écritures :
- Sélection d'un compte
- Affichage des écritures non lettrées
- Lettrage automatique ou manuel
- Génération de codes de lettrage

### 7. 📄 Rapports
Édition de documents comptables :
- **Balance** : Soldes de tous les comptes
- **Grand Livre** : Détail par compte
- **FEC (Fichier des Écritures Comptables)** : Export légal
- **TVA** : Déclaration TVA
- Export PDF et CSV
- Graphiques d'analyse

### 8. ⚙️ Paramètres
Configuration de l'application :
- Informations de l'entreprise
- Exercice comptable (dates de début/fin)
- Régime TVA
- Plan comptable (PCG, PCG simplifié, Associations)

### 9. 🤖 Assistant IA
Intelligence artificielle pour aide comptable :
- Powered by Claude AI (Anthropic)
- Questions/réponses sur la comptabilité
- Suggestions contextuelles
- Analyse de documents
- Explications de concepts comptables

---

## ⌨️ Raccourcis Clavier

### Navigation
- `Ctrl + K` : Ouvrir la Command Palette
- `←` / `→` : Section précédente/suivante
- `↑` / `↓` : Section précédente/suivante
- `Esc` : Fermer les modals/palette

### Actions (à venir)
- `Ctrl + N` : Nouvelle écriture
- `Ctrl + S` : Sauvegarder
- `Ctrl + F` : Rechercher
- `/` : Focus sur la recherche

---

## 🎨 Fonctionnalités UX Avancées

### Navigation Horizontale Unique
- **Scroll vertical = Navigation horizontale** : Innovation UX majeure
- Détection de position (haut/bas de section)
- Accumulation de scroll pour éviter déclenchements accidentels
- Transition fluide 700ms avec ease-in-out

### Command Palette (Ctrl+K)
- Recherche fuzzy dans toutes les sections
- Navigation rapide par mots-clés
- Affichage des descriptions
- Groupement par catégorie

### Loading States
- **Skeletons animés** au chargement
- Préservation de la structure visuelle
- Amélioration de la perception de performance

### Virtual Scrolling
- Active automatiquement pour listes > 10 éléments
- Rend uniquement les éléments visibles
- Performance optimale avec milliers d'entrées

### Animations
- **GPU-accelerated** (transform, opacity)
- Micro-interactions au hover
- Feedback visuel instantané
- Transitions fluides entre états

---

## 🗄️ Base de Données (Supabase)

### Tables Principales

**companies** - Sociétés
```sql
id, name, siret, address, email, phone, created_at, updated_at
```

**accounts** - Comptes comptables
```sql
id, company_id, numero (6 digits), intitule, type, created_at
```

**journals** - Journaux
```sql
id, company_id, code (AC/VT/BQ/CA/OD), intitule, type, created_at
```

**journal_entries** - Écritures comptables
```sql
id, company_id, batch_id, journal_code, compte,
s (D/C), montant, libelle, date_ecriture,
status (draft/posted), letter_code, created_at, updated_at
```

**company_settings** - Paramètres
```sql
id, company_id, fiscal_year_start, fiscal_year_end,
vat_regime, accounting_plan, created_at, updated_at
```

---

## 📊 Calculs Comptables

### Trésorerie
```
Trésorerie = Solde Banque (512xxx) + Solde Caisse (53xxx)
Avec : Débit positif, Crédit négatif
```

### Résultat
```
Résultat = Produits (Classe 7) - Charges (Classe 6)
Produits : Crédit positif
Charges : Débit positif
```

### Équilibrage d'écriture
```
Lot équilibré si : |Σ Débits - Σ Crédits| < 0.01€
```

---

## 📈 Performances

### Métriques Actuelles
- **First Contentful Paint** : < 1.5s
- **Time to Interactive** : < 3s
- **Virtual Scrolling** : Supporte 10,000+ items
- **Bundle Size** : ~450KB gzipped

### Optimisations Implémentées
- Code splitting par route
- Lazy loading des sections
- Virtual scrolling pour grandes listes
- Memoization des calculs lourds
- GPU-accelerated animations

---

## 📄 Documentation Complémentaire

- 📘 **FONCTIONNALITES.md** : Guide détaillé de toutes les fonctionnalités
- 📗 **GUIDE_UTILISATEUR.md** : Guide d'utilisation pas à pas
- ⌨️ **RACCOURCIS_CLAVIER.md** : Liste complète des raccourcis

---

## 🔧 Configuration Avancée

### Personnalisation du Thème

Modifier `app/globals.css` :
```css
:root {
  --background: oklch(1 0 0);      /* Blanc */
  --foreground: oklch(0.145 0 0);  /* Noir */
  --primary: oklch(0.205 0 0);     /* Gris foncé */
  /* ... */
}
```

---

## 🐛 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifier les ports
netstat -ano | findstr :3000
netstat -ano | findstr :4000
netstat -ano | findstr :5000

# Tuer les processus si nécessaire
taskkill /PID <PID> /F
```

### Erreurs de build
```bash
# Nettoyer le cache
rm -rf .next node_modules
npm install
npm run dev
```

---

## 🚧 Roadmap

### Version 1.1 (À venir)
- [ ] Authentification utilisateurs
- [ ] Permissions par rôle
- [ ] Import CSV/Excel
- [ ] Mode offline
- [ ] Thèmes personnalisables

### Version 1.2
- [ ] Multi-sociétés
- [ ] Workflow de validation
- [ ] Notifications temps réel
- [ ] Audit trail complet
- [ ] API publique documentée

---

## 📄 Licence

**Propriétaire** - TAC Hockey Club

Tous droits réservés. Ce projet est développé pour un usage interne uniquement.

---

## 👥 Équipe

**Développement** : Équipe AS400 Horizontal
**Client** : TAC Hockey Club
**IA** : Claude AI (Anthropic)

---

## 🎉 Remerciements

- **Next.js Team** pour le framework
- **Vercel** pour l'hébergement
- **Supabase** pour la base de données
- **Anthropic** pour Claude AI
- **TAC Hockey** pour la confiance

---

**Version** : 1.0.0
**Dernière mise à jour** : 2025-01-08
**Développé avec ❤️ pour le TAC Hockey Club**
