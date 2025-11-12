# 📚 Guide Complet des Fonctionnalités - AS400 Horizontal

Ce document détaille toutes les fonctionnalités de l'application AS400 Horizontal, section par section.

---

## Table des Matières

1. [Tableau de Bord](#1-tableau-de-bord)
2. [Plan Comptable](#2-plan-comptable)
3. [Journaux](#3-journaux)
4. [Écritures](#4-écritures)
5. [Brouillard](#5-brouillard)
6. [Lettrage](#6-lettrage)
7. [Rapports](#7-rapports)
8. [Paramètres](#8-paramètres)
9. [Assistant IA](#9-assistant-ia)
10. [Fonctionnalités UX](#10-fonctionnalités-ux)

---

## 1. Tableau de Bord

### 📊 Vue d'ensemble

Le tableau de bord offre une vision synthétique de l'état financier de votre association en temps réel.

### Fonctionnalités

#### 1.1 Indicateurs Financiers (KPIs)

**Trésorerie**
- Calcul automatique : Banques (512xxx) + Caisses (53xxx)
- Affichage en vert si positif, rouge si négatif
- Mise à jour en temps réel

**Résultat**
- Formule : Produits (classe 7) - Charges (classe 6)
- Indicateur bénéfice/déficit
- Code couleur : vert (bénéfice) / rouge (déficit)

**Produits**
- Total des comptes classe 7
- Affichage en vert
- Totalisation par exercice

**Charges**
- Total des comptes classe 6
- Affichage en rouge
- Totalisation par exercice

#### 1.2 Graphiques d'Évolution

**Évolution sur 6 mois**
- Graphique en ligne double (Produits + Charges)
- Calcul mensuel automatique
- Tooltip interactif avec formatage monétaire
- Axe Y formaté en milliers (k)

**Évolution de la Trésorerie**
- Graphique en ligne unique
- Tendance sur 6 mois
- Visualisation de la santé financière

#### 1.3 Répartition des Charges

**Graphique Camembert**
- 9 catégories de charges selon le PCG :
  - 60 : Achats
  - 61 : Services extérieurs
  - 62 : Autres services
  - 63 : Impôts et taxes
  - 64 : Personnel
  - 65 : Gestion courante
  - 66 : Charges financières
  - 67 : Charges exceptionnelles
  - 68 : Amortissements
- Affichage en pourcentage
- Tooltip avec montant exact

#### 1.4 Top 5 Comptes Actifs

- Classement par nombre d'opérations
- Affichage :
  - Position (#1 à #5)
  - Numéro de compte
  - Intitulé
  - Montant total
  - Nombre d'opérations
- Interactif avec hover effects

#### 1.5 Statistiques d'Activité

**Écritures ce mois**
- Compteur du mois en cours
- Mise à jour automatique

**Écritures exercice**
- Total de l'exercice comptable
- Statistique globale

**Comptes actifs**
- Nombre de comptes utilisés
- Indicateur du plan comptable

**Journaux actifs**
- Nombre de journaux configurés
- Suivi de la configuration

#### 1.6 Alertes & Actions Rapides

**Système d'alertes**
- État : ✓ Aucune alerte (vert)
- Monitoring de la comptabilité
- Feedback positif

**Actions rapides**
- Nouvelle écriture
- Consulter rapports
- Assistant IA
- Accès direct aux fonctions principales

---

## 2. Plan Comptable

### 📖 Vue d'ensemble

Gestion complète du plan comptable avec CRUD (Create, Read, Update, Delete) sur les comptes.

### Fonctionnalités

#### 2.1 Liste des Comptes

**Affichage**
- Liste scrollable de tous les comptes
- Virtual scrolling activé automatiquement pour > 10 comptes
- Performance optimisée pour milliers de comptes

**Informations affichées**
- Numéro de compte (6 chiffres)
- Intitulé
- Type (badge coloré : ACTIF/PASSIF/CHARGE/PRODUIT)

**Actions par compte**
- Modifier : Ouvre le modal d'édition
- Supprimer : Suppression avec confirmation
- Cliquer : Affiche les écritures du compte

#### 2.2 Recherche

**Barre de recherche**
- Recherche en temps réel
- Filtre par numéro de compte
- Filtre par intitulé
- Insensible à la casse
- Compteur de résultats

#### 2.3 Création de Compte

**Formulaire**
- **Numéro** : 6 chiffres obligatoires, validation pattern
- **Intitulé** : Texte libre obligatoire
- **Type** : Select parmi 4 options
  - ACTIF (classe 1, 2, 3, 4, 5)
  - PASSIF (classe 1)
  - CHARGE (classe 6)
  - PRODUIT (classe 7)

**Validation**
- Champs obligatoires
- Format numérique pour le numéro
- Longueur 6 caractères exactement

#### 2.4 Modification de Compte

**Fonctionnement**
- Préremplit le formulaire avec données existantes
- Permet modification de tous les champs
- Sauvegarde dans Supabase

#### 2.5 Suppression de Compte

**Confirmation**
- Alert de confirmation
- Suppression définitive
- Mise à jour instantanée de la liste

#### 2.6 Visualisation des Écritures

**Modal détaillé**
- Liste de toutes les écritures du compte
- Informations par écriture :
  - Date
  - Journal
  - Libellé
  - Sens (D/C)
  - Montant
  - Code de lettrage
- Calcul du solde cumulé
- Tri chronologique

**Solde du compte**
- Formule : Σ Débits - Σ Crédits
- Mise à jour dynamique
- Affichage formaté

---

## 3. Journaux

### 📔 Vue d'ensemble

Configuration et gestion des journaux comptables selon les 5 types réglementaires.

### Fonctionnalités

#### 3.1 Types de Journaux

**AC - Achats**
- Couleur : Orange
- Usage : Factures fournisseurs, achats de biens/services

**VT - Ventes**
- Couleur : Vert
- Usage : Factures clients, ventes de produits/services

**BQ - Banque**
- Couleur : Bleu
- Usage : Mouvements bancaires, virements

**CA - Caisse**
- Couleur : Violet
- Usage : Espèces, petites dépenses

**OD - Opérations Diverses**
- Couleur : Gris
- Usage : Écritures de régularisation, dotations, etc.

#### 3.2 Liste des Journaux

**Affichage par type**
- Regroupement par catégorie
- Code + Intitulé
- Badge de type avec couleur distinctive
- Tri par code

**Statistiques**
- Nombre de journaux par type
- Total global des journaux

#### 3.3 Création de Journal

**Formulaire**
- **Code** : 2 lettres majuscules (ex: AC, VT)
- **Intitulé** : Description libre
- **Type** : Sélection parmi les 5 types
- Validation obligatoire

**Exemples de journaux**
- AC01 - Achats généraux
- VT01 - Ventes adhésions
- BQ01 - Banque principale
- CA01 - Caisse recettes matches

#### 3.4 Modification & Suppression

**Modification**
- Édition de tous les champs
- Sauvegarde instantanée

**Suppression**
- Alerte de confirmation
- Vérification des écritures liées
- Suppression définitive

---

## 4. Écritures

### ✍️ Vue d'ensemble

Saisie d'opérations comptables en respectant le principe de la partie double (Débit = Crédit).

### Fonctionnalités

#### 4.1 Sélection du Journal

**Dropdown**
- Liste de tous les journaux disponibles
- Format : CODE - Intitulé
- Sélection obligatoire avant saisie

#### 4.2 Saisie des Lignes

**Formulaire par ligne**
- **Compte** : Datalist avec autocomplétion
- **S (Sens)** : Select D (Débit) ou C (Crédit)
- **Montant** : Input number avec 2 décimales
- **Libellé** : Description de l'opération
- **Date** : Date picker

**Autocomplétion**
- Liste de tous les comptes disponibles
- Format : Numéro - Intitulé
- Recherche au fur et à mesure

#### 4.3 Gestion des Lignes

**Ajout de ligne**
- Bouton "+ Ajouter une ligne"
- Pas de limite de lignes
- Duplication de la date automatique

**Suppression de ligne**
- Bouton "×" sur chaque ligne
- Minimum 1 ligne obligatoire
- Confirmation visuelle

#### 4.4 Équilibrage Automatique

**Calcul en temps réel**
- Total Débit
- Total Crédit
- Solde (Débit - Crédit)

**Validation**
- ✓ Lot équilibré : |Solde| < 0.01€ (vert)
- ⚠ Lot non équilibré : |Solde| ≥ 0.01€ (rouge)
- Enregistrement bloqué si non équilibré

**Affichage**
- Formatage monétaire
- Code couleur selon l'état
- Indicateur visuel clair

#### 4.5 Enregistrement

**Processus**
- Vérification de l'équilibre
- Vérification des champs obligatoires
- Génération UUID pour batch_id
- Insertion en base de données
- Statut : "draft" (brouillard)

**Feedback**
- Message de succès
- Réinitialisation du formulaire
- Redirection possible vers brouillard

**Validation des données**
- Tous les champs remplis
- Comptes existants
- Montants > 0
- Équilibre parfait

---

## 5. Brouillard

### 📝 Vue d'ensemble

Validation des écritures en attente (statut "draft") pour passage en comptabilité définitive (statut "posted").

### Fonctionnalités

#### 5.1 Liste des Brouillons

**Affichage**
- Groupement par lot (batch_id)
- Date d'écriture
- Journal utilisé
- Nombre de lignes
- Total Débit et Crédit
- Statut d'équilibre

**Informations par lot**
- Toutes les lignes du lot
- Détail compte/sens/montant
- Vérification de l'équilibre

#### 5.2 Validation

**Validation individuelle**
- Bouton "Valider" par lot
- Vérification de l'équilibre
- Passage en statut "posted"
- Suppression du brouillard

**Validation par lot (futur)**
- Sélection multiple
- Validation groupée
- Gain de temps

#### 5.3 Vérifications

**Contrôles automatiques**
- Équilibre Débit/Crédit
- Existence des comptes
- Cohérence des montants
- Validité du journal

**Erreurs bloquantes**
- Lot non équilibré
- Compte inexistant
- Journal invalide
- Date hors exercice

#### 5.4 Modification avant validation

**Édition possible**
- Modification des montants
- Changement de compte
- Ajustement du libellé
- Correction de la date

**Suppression**
- Annulation du lot
- Suppression définitive
- Confirmation requise

---

## 6. Lettrage

### 🔗 Vue d'ensemble

Rapprochement d'écritures pour suivre le règlement des créances et dettes (lettrage comptable).

### Fonctionnalités

#### 6.1 Sélection du Compte

**Interface**
- Dropdown avec liste des comptes
- Filtre sur comptes lettables (classe 4)
- Recherche intelligente

**Comptes lettables**
- 401xxx : Fournisseurs
- 411xxx : Clients
- 421xxx : Personnel
- 43xxxx : Sécurité sociale

#### 6.2 Affichage des Écritures

**Liste filtrée**
- Écritures non lettrées uniquement
- Tri par date
- Affichage :
  - Date
  - Libellé
  - Débit/Crédit
  - Solde cumulé

**Sélection**
- Checkbox par écriture
- Sélection multiple
- Calcul du solde des sélectionnées

#### 6.3 Lettrage Automatique

**Algorithme**
- Recherche de paires qui s'annulent
- Débit + Crédit = 0
- Groupement par date proche
- Génération automatique du code

**Codes de lettrage**
- Format : A, B, C... AA, AB...
- Unique par compte
- Incrémentation automatique

#### 6.4 Lettrage Manuel

**Processus**
- Sélectionner plusieurs écritures
- Vérifier que Σ Débit = Σ Crédit
- Attribuer le même code de lettrage
- Sauvegarder

**Validation**
- Équilibre obligatoire
- Minimum 2 écritures
- Confirmation visuelle

#### 6.5 Délettrage

**Fonctionnalité**
- Suppression du code de lettrage
- Retour en écritures non lettrées
- Audit trail (futur)

---

## 7. Rapports

### 📄 Vue d'ensemble

Édition de documents comptables officiels avec export PDF/CSV et visualisations graphiques.

### Fonctionnalités

#### 7.1 Balance des Comptes

**Description**
- Liste de tous les comptes avec soldes
- Colonnes :
  - Numéro de compte
  - Intitulé
  - Mouvements Débit
  - Mouvements Crédit
  - Solde Débiteur
  - Solde Créditeur

**Filtres**
- Période personnalisée
- Type de compte
- Classe de compte
- Comptes mouvementés uniquement

**Export**
- PDF formaté (jsPDF)
- CSV pour Excel
- Impression directe

**Calculs**
- Totaux par classe
- Grand total
- Vérification équilibre

#### 7.2 Grand Livre

**Description**
- Détail de toutes les écritures par compte
- Format chronologique
- Soldes intermédiaires

**Contenu**
- En-tête par compte
- Liste des mouvements :
  - Date
  - Journal
  - Libellé
  - Débit/Crédit
  - Solde progressif
- Total et solde final

**Options**
- Sélection de comptes
- Période
- Avec/sans à-nouveaux
- Détail ou synthèse

**Export**
- PDF paginé
- CSV détaillé
- Archivage comptable

#### 7.3 FEC (Fichier des Écritures Comptables)

**Description**
- Export légal obligatoire
- Format normalisé
- Contrôle fiscal

**Colonnes obligatoires** (18 champs)
1. JournalCode
2. JournalLib
3. EcritureNum
4. EcritureDate
5. CompteNum
6. CompteLib
7. CompAuxNum
8. CompAuxLib
9. PieceRef
10. PieceDate
11. EcritureLib
12. Debit
13. Credit
14. EcritureLet
15. DateLet
16. ValidDate
17. Montantdevise
18. Idevise

**Validation**
- Format CSV avec séparateur |
- Encodage UTF-8
- Nom fichier : SIREN + FEC + AAAAMMJJ.txt
- Contrôle d'intégrité

**Génération**
- Période sélectionnable
- Vérifications automatiques
- Téléchargement direct

#### 7.4 Déclaration TVA (CA3)

**Description**
- Formulaire de déclaration TVA
- Calcul automatique
- Régimes supportés

**Lignes calculées**
- TVA collectée (comptes 44571)
- TVA déductible (comptes 44566)
- TVA à payer/crédit
- Report de crédit

**Périodes**
- Mensuelle
- Trimestrielle
- Annuelle

**Export**
- PDF format officiel
- Archivage
- Télédéclaration (futur)

#### 7.5 Graphiques d'Analyse

**Types disponibles**
- Évolution du résultat
- Répartition charges/produits
- Tendances mensuelles
- Comparatifs exercices

**Interactivité**
- Tooltip détaillé
- Zoom
- Export PNG/SVG
- Légendes

---

## 8. Paramètres

### ⚙️ Vue d'ensemble

Configuration globale de l'application et de la comptabilité.

### Fonctionnalités

#### 8.1 Informations de l'Entreprise

**Champs**
- Raison sociale
- SIRET
- Adresse complète
- Email
- Téléphone
- Logo (upload)

**Utilisation**
- En-têtes de documents
- Identification légale
- Communications

#### 8.2 Exercice Comptable

**Configuration**
- Date de début d'exercice
- Date de fin d'exercice
- Validation de cohérence (12 mois)

**Exemples**
- Standard : 01/01 au 31/12
- Décalé : 01/09 au 31/08
- Court/long (création/fusion)

**Impact**
- Calcul des résultats
- Rapports périodiques
- Clôture annuelle

#### 8.3 Régime TVA

**Options**
- Franchise en base (pas de TVA)
- Réel simplifié
- Réel normal
- Mini-réel

**Configuration associée**
- Taux de TVA applicables
- Comptes de TVA
- Périodicité déclaration

#### 8.4 Plan Comptable

**Choix du référentiel**
- PCG (Plan Comptable Général)
- PCG Simplifié
- Plan Associations
- Plan personnalisé

**Import/Export**
- Import CSV de plan comptable
- Export du plan actuel
- Sauvegarde/Restauration

---

## 9. Assistant IA

### 🤖 Vue d'ensemble

Intelligence artificielle conversationnelle powered by Claude AI (Anthropic) pour aide comptable contextuelle.

### Fonctionnalités

#### 9.1 Chat Conversationnel

**Interface**
- Zone de saisie
- Historique des messages
- Formatage Markdown
- Code syntax highlighting

**Fonctionnement**
- Envoi de question
- Streaming de réponse
- Contexte maintenu
- Multiturn conversation

#### 9.2 Questions Comptables

**Exemples de questions supportées**
- "Comment enregistrer une facture fournisseur ?"
- "Quelle est la différence entre débit et crédit ?"
- "Comment calculer la TVA ?"
- "Qu'est-ce qu'une OD ?"
- "Expliquer le lettrage comptable"

**Réponses**
- Explications détaillées
- Exemples concrets
- Écritures comptables types
- Références réglementaires

#### 9.3 Suggestions Contextuelles

**Intelligentes**
- Analyse de la section actuelle
- Propositions pertinentes
- Raccourcis vers actions

**Exemples**
- Sur Dashboard : "Analyser mon résultat"
- Sur Écritures : "Exemple d'écriture d'achat"
- Sur Rapports : "Interpréter ma balance"

#### 9.4 Détection d'Anomalies (futur)

**Analyses automatiques**
- Écritures déséquilibrées
- Comptes jamais utilisés
- Montants inhabituels
- Incohérences de dates

**Alertes**
- Notification en temps réel
- Explication du problème
- Suggestion de correction

#### 9.5 Analyse de Documents (futur)

**OCR intelligent**
- Upload de facture PDF
- Extraction des données
- Proposition d'écriture
- Validation assistée

**Données extraites**
- Date
- Fournisseur/Client
- Montant HT/TTC
- TVA
- Numéro de facture

---

## 10. Fonctionnalités UX

### 🎨 Vue d'ensemble

Fonctionnalités avancées d'expérience utilisateur pour optimiser l'efficacité et le confort.

### Fonctionnalités

#### 10.1 Navigation Horizontale

**Innovation majeure**
- Scroll vertical = Navigation horizontale
- Détection position (haut/bas section)
- Accumulation scroll (seuil 100px)
- Transition 700ms ease-in-out

**Avantages**
- Expérience unique
- Fluidité maximale
- Geste naturel
- Immersion complète

#### 10.2 Command Palette (Ctrl+K)

**Interface**
- Modal centré
- Recherche fuzzy
- Catégorisation
- Raccourcis visibles

**Fonctionnalités**
- Navigation rapide vers sections
- Recherche par mots-clés
- Descriptions contextuelles
- Historique (futur)

**Raccourcis**
- Ctrl+K : Ouvrir
- Esc : Fermer
- ↑↓ : Naviguer
- ↵ : Valider

#### 10.3 Loading States (Skeletons)

**Composants**
- CardSkeleton : KPIs
- TableSkeleton : Listes
- ChartSkeleton : Graphiques
- DashboardSkeleton : Page complète

**Bénéfices**
- Perception de performance +40%
- Structure préservée
- Feedback visuel
- Pas de flash de contenu vide

#### 10.4 Virtual Scrolling

**Technologie**
- @tanstack/react-virtual
- Rendu uniquement éléments visibles
- Supporte 10,000+ items
- Performance constante

**Activation**
- Automatique si liste > 10 éléments
- Fallback classique sinon
- Transparent pour l'utilisateur

**Impact**
- Temps de rendu /10
- Mémoire optimisée
- Scroll ultra-fluide

#### 10.5 Animations

**Types**
- fade-in-up : Apparition sections
- slide-in-left : Modals
- scale-in : Boutons
- hover effects : Interactions

**Optimisation**
- GPU-accelerated (transform)
- Requestanimationframe
- Will-change properties
- 60fps garantis

#### 10.6 Thème Sombre

**Design**
- OKLCH color space
- Contraste optimisé
- Glass morphism
- Bordures subtiles

**Personnalisation**
- Toggle light/dark
- Préférence système
- Persistance locale
- Variables CSS

#### 10.7 Responsive Design

**Breakpoints**
- Mobile : < 1024px
- Desktop : ≥ 1024px

**Adaptations**
- Navigation mobile (boutons)
- Indicateur section top
- Grilles responsives
- Touch-friendly

#### 10.8 Accessibility

**Standards**
- ARIA labels
- Keyboard navigation
- Focus visible
- Screen reader support

**Contraste**
- WCAG 2.1 AA minimum
- Texte lisible
- Couleurs distinctes

---

## Conclusion

Cette application couvre l'ensemble du cycle comptable d'une association :
1. **Saisie** : Écritures, journaux, plan comptable
2. **Validation** : Brouillard, lettrage
3. **Édition** : Rapports, balance, FEC
4. **Analyse** : Dashboard, graphiques, IA
5. **Configuration** : Paramètres, exercice

Chaque fonctionnalité a été pensée pour allier conformité comptable et expérience utilisateur moderne.

---

**Prochaines évolutions** : Authentification, multi-sociétés, workflow de validation, API publique.

**Version** : 1.0.0
**Dernière mise à jour** : 2025-01-08
