# 📗 Guide Utilisateur - AS400 Horizontal

Bienvenue dans AS400 Horizontal ! Ce guide vous accompagne pas à pas dans l'utilisation de l'application.

---

## Table des Matières

1. [Démarrage Rapide](#démarrage-rapide)
2. [Premiers Pas](#premiers-pas)
3. [Navigation](#navigation)
4. [Cas d'Usage Pratiques](#cas-dusage-pratiques)
5. [Bonnes Pratiques](#bonnes-pratiques)
6. [FAQ](#faq)
7. [Dépannage](#dépannage)

---

## Démarrage Rapide

### 5 Minutes pour Commencer

1. **Lancer l'application**
   ```bash
   cd as400-horizontal
   npm run dev
   ```
   Ouvrir http://localhost:3000

2. **Explorer les sections**
   - Scrollez verticalement pour naviguer horizontalement
   - Ou utilisez la barre latérale (desktop)

3. **Tester avec Ctrl+K**
   - Appuyez sur `Ctrl + K`
   - Tapez "dashboard" et Entrée
   - Vous êtes sur le tableau de bord !

4. **Voir le Dashboard**
   - Indicateurs financiers
   - Graphiques
   - Statistiques

5. **Découvrir les autres sections**
   - Flèches clavier ← →
   - Command Palette
   - Barre de navigation

---

## Premiers Pas

### 1. Configuration Initiale

#### A. Paramètres de l'Entreprise

1. Naviguez vers **Paramètres** (section 8)
   - Ctrl+K → "Paramètres" → Entrée
   - Ou scrollez jusqu'à la fin

2. Remplissez les informations
   ```
   Raison sociale : TAC Hockey Club
   SIRET : 12345678900012
   Adresse : 123 Rue du Sport, 75000 Paris
   Email : contact@tachockey.fr
   Téléphone : 01 23 45 67 89
   ```

3. Configurez l'exercice comptable
   ```
   Début : 01/09/2024
   Fin : 31/08/2025
   ```

4. Choisissez le régime TVA
   ```
   [ ] Franchise en base (recommandé pour associations)
   ```

5. Sélectionnez le plan comptable
   ```
   [x] Plan Associations
   ```

6. Cliquez sur "Sauvegarder"

#### B. Créer le Plan Comptable de Base

1. Allez dans **Plan Comptable** (section 2)

2. Créez vos comptes essentiels :

   **Classe 1 - Capitaux**
   ```
   102000 - Fonds associatif sans droit de reprise
   110000 - Report à nouveau
   120000 - Résultat de l'exercice
   ```

   **Classe 4 - Tiers**
   ```
   401000 - Fournisseurs
   411000 - Membres - cotisations à recevoir
   421000 - Personnel - rémunérations dues
   ```

   **Classe 5 - Financier**
   ```
   512000 - Banque
   530000 - Caisse
   ```

   **Classe 6 - Charges**
   ```
   606100 - Fournitures non stockables (équipements)
   613000 - Locations
   623100 - Publicité, publications
   641100 - Salaires
   ```

   **Classe 7 - Produits**
   ```
   706000 - Prestations de services (adhésions)
   754000 - Subventions d'équilibre
   ```

3. Pour chaque compte :
   - Cliquez sur "+ Nouveau compte"
   - Entrez le numéro (6 chiffres)
   - Saisissez l'intitulé
   - Choisissez le type
   - Validez

#### C. Configurer les Journaux

1. Allez dans **Journaux** (section 3)

2. Créez vos journaux :

   ```
   AC - Achats
   VT - Ventes (cotisations)
   BQ - Banque
   CA - Caisse
   OD - Opérations diverses
   ```

3. Pour chaque journal :
   - Cliquez sur "+ Nouveau journal"
   - Code : 2 lettres (AC, VT, etc.)
   - Intitulé : Description claire
   - Type : Sélectionner dans la liste
   - Valider

---

## Navigation

### Méthodes de Navigation

#### 1. Scroll Vertical (Recommandé)

**Comment ça marche**
- Scrollez **vers le bas** → Va à la section suivante (droite)
- Scrollez **vers le haut** → Va à la section précédente (gauche)

**Comportement**
- Fonctionne uniquement en haut/bas de section
- Accumulation de scroll nécessaire (évite déclenchements accidentels)
- Transition fluide 700ms

**Astuces**
- Scrollez rapidement pour changer de section
- Scrollez lentement pour rester dans la section
- Attendez la fin de la transition

#### 2. Raccourcis Clavier

**Navigation**
```
← ou ↑    : Section précédente
→ ou ↓    : Section suivante
Ctrl + K  : Ouvrir Command Palette
Esc       : Fermer modals/palette
```

**Workflow**
1. `Ctrl + K` pour ouvrir la palette
2. Taper le nom de la section
3. `Entrée` pour y aller

#### 3. Barre Latérale (Desktop)

**Utilisation**
- À gauche de l'écran
- 9 indicateurs (un par section)
- Actif = barre blanche pleine
- Inactif = barre grisée

**Interaction**
- Cliquez pour aller à la section
- Hover pour voir le nom
- Tooltip explicatif

#### 4. Navigation Mobile

**Éléments**
- Indicateur en haut : Nom de la section
- Boutons en bas : Flèches ← →

**Touch**
- Swipe gauche/droite (futur)
- Tap sur les flèches

---

## Cas d'Usage Pratiques

### Scénario 1 : Enregistrer une Cotisation d'Adhérent

**Contexte** : Un membre paie sa cotisation annuelle de 150€ en espèces.

**Étapes**

1. **Aller dans Écritures** (section 4)
   - Ctrl+K → "Écritures"

2. **Sélectionner le journal**
   - Journal : **CA - Caisse**

3. **Première ligne (Débit)**
   ```
   Compte  : 530000 (Caisse)
   Sens    : D (Débit)
   Montant : 150.00
   Libellé : Cotisation M. Dupont - Saison 2024/2025
   Date    : 15/09/2024
   ```

4. **Deuxième ligne (Crédit)**
   ```
   Compte  : 706000 (Prestations de services)
   Sens    : C (Crédit)
   Montant : 150.00
   Libellé : Cotisation M. Dupont - Saison 2024/2025
   Date    : 15/09/2024
   ```

5. **Vérifier l'équilibre**
   - Débit total : 150.00€
   - Crédit total : 150.00€
   - Solde : 0.00€ ✓

6. **Enregistrer**
   - Cliquez "Enregistrer le lot"
   - Message de succès

7. **Valider depuis le Brouillard**
   - Aller dans **Brouillard** (section 5)
   - Trouver le lot
   - Cliquer "Valider"
   - L'écriture est définitive

**Résultat** : +150€ en caisse, +150€ de produits

---

### Scénario 2 : Enregistrer une Facture Fournisseur

**Contexte** : Achat d'équipements sportifs pour 500€ HT (600€ TTC), payable à 30 jours.

**Étapes**

1. **Aller dans Écritures**

2. **Journal : AC - Achats**

3. **Première ligne : La charge**
   ```
   Compte  : 606100 (Fournitures)
   Sens    : D
   Montant : 500.00
   Libellé : Équipements sportifs - Facture F2024-089
   Date    : 20/09/2024
   ```

4. **Deuxième ligne : La TVA**
   ```
   Compte  : 445660 (TVA déductible)
   Sens    : D
   Montant : 100.00
   Libellé : TVA sur équipements - Facture F2024-089
   Date    : 20/09/2024
   ```

5. **Troisième ligne : La dette**
   ```
   Compte  : 401000 (Fournisseurs)
   Sens    : C
   Montant : 600.00
   Libellé : Fournisseur XYZ - Facture F2024-089
   Date    : 20/09/2024
   ```

6. **Vérifier et enregistrer**
   - Débit : 500 + 100 = 600€
   - Crédit : 600€
   - Équilibré ✓

7. **Valider**

**Résultat** : +500€ de charges, +100€ de TVA à récupérer, +600€ de dettes

---

### Scénario 3 : Enregistrer le Paiement de la Facture

**Contexte** : 30 jours plus tard, on paie le fournisseur par virement bancaire.

**Étapes**

1. **Écritures → Journal : BQ - Banque**

2. **Première ligne : La dette**
   ```
   Compte  : 401000 (Fournisseurs)
   Sens    : D
   Montant : 600.00
   Libellé : Paiement Fournisseur XYZ - F2024-089
   Date    : 20/10/2024
   ```

3. **Deuxième ligne : La banque**
   ```
   Compte  : 512000 (Banque)
   Sens    : C
   Montant : 600.00
   Libellé : Virement Fournisseur XYZ
   Date    : 20/10/2024
   ```

4. **Valider**

5. **Lettrer les écritures**
   - Aller dans **Lettrage** (section 6)
   - Sélectionner compte **401000**
   - Cocher l'écriture d'achat (C 600€)
   - Cocher l'écriture de paiement (D 600€)
   - Cliquer "Lettrer"
   - Les deux lignes portent maintenant le même code (ex: A)

**Résultat** : -600€ en banque, dette soldée et lettrée

---

### Scénario 4 : Recevoir une Subvention

**Contexte** : La mairie accorde une subvention de 2000€.

**Étapes**

1. **Écritures → Journal : BQ**

2. **Première ligne : La banque**
   ```
   Compte  : 512000
   Sens    : D
   Montant : 2000.00
   Libellé : Subvention Mairie 2024
   Date    : 05/10/2024
   ```

3. **Deuxième ligne : Le produit**
   ```
   Compte  : 754000 (Subventions d'équilibre)
   Sens    : C
   Montant : 2000.00
   Libellé : Subvention Mairie 2024
   Date    : 05/10/2024
   ```

4. **Valider**

**Résultat** : +2000€ en banque, +2000€ de produits exceptionnels

---

### Scénario 5 : Éditer la Balance

**Contexte** : Fin de mois, vous voulez éditer la balance comptable.

**Étapes**

1. **Aller dans Rapports** (section 7)

2. **Sélectionner "Balance"**

3. **Choisir la période**
   ```
   Du : 01/09/2024
   Au : 30/09/2024
   ```

4. **Options**
   - [x] Comptes mouvementés uniquement
   - [ ] Tous les comptes
   - [ ] Par classe uniquement

5. **Générer**
   - Cliquer "Générer la balance"
   - Visualisation à l'écran

6. **Export**
   - Cliquer "Exporter PDF"
   - Ou "Exporter CSV" pour Excel

7. **Vérifier**
   - Total Débit = Total Crédit
   - Cohérence des soldes

**Résultat** : Document comptable officiel

---

### Scénario 6 : Utiliser l'Assistant IA

**Contexte** : Vous avez une question comptable.

**Étapes**

1. **Aller dans Assistant IA** (section 9)

2. **Poser votre question**
   ```
   "Comment enregistrer un remboursement de frais kilométriques ?"
   ```

3. **Lire la réponse**
   - Explications détaillées
   - Exemple d'écriture
   - Comptes à utiliser

4. **Suivre les instructions**
   - Appliquer dans votre comptabilité

5. **Poser une question de suivi**
   ```
   "Quel est le barème kilométrique 2024 ?"
   ```

**Résultat** : Aide contextuelle instantanée

---

## Bonnes Pratiques

### Organisation

**Nomenclature des libellés**
```
✓ Bon : "Cotisation M. Dupont - Saison 2024/2025"
✓ Bon : "Achat équipements - Facture F2024-089"
✗ Mauvais : "Achat"
✗ Mauvais : "Facture"
```

**Numérotation des pièces**
```
Factures : F2024-001, F2024-002...
Reçus : R2024-001, R2024-002...
Avoirs : A2024-001, A2024-002...
```

### Saisie

**Fréquence**
- Quotidienne : Idéal
- Hebdomadaire : Minimum
- Mensuelle : Risqué (oublis)

**Vérifications**
- Toujours vérifier l'équilibre
- Relire les libellés
- Contrôler les montants
- Valider rapidement depuis le brouillard

**Pièces justificatives**
- Scanner ou photographier
- Nommer avec référence (ex: F2024-089.pdf)
- Archiver numériquement

### Validation

**Brouillard**
- Ne pas laisser traîner
- Valider quotidiennement
- Maximum 48h en brouillard

**Lettrage**
- Lettrer dès paiement/encaissement
- Facilite le suivi
- Évite les erreurs

### Rapports

**Édition régulière**
- Balance mensuelle
- Grand Livre semestriel
- FEC annuel (obligatoire)

**Archivage**
- Conserver 10 ans minimum
- Format PDF + CSV
- Backup externe

---

## FAQ

### Questions Générales

**Q : Comment annuler une écriture validée ?**
R : Créer une écriture d'extourne (inverse). Jamais de suppression en comptabilité.

**Q : Puis-je modifier une écriture après validation ?**
R : Non. Créer une écriture corrective.

**Q : Combien de temps conserver les documents ?**
R : 10 ans minimum pour les associations.

**Q : Dois-je enregistrer toutes les petites dépenses ?**
R : Oui, exhaustivité obligatoire.

**Q : Puis-je utiliser l'application sur mobile ?**
R : Oui, responsive design. Navigation adaptée.

### Questions Techniques

**Q : Pourquoi l'équilibre ne fonctionne pas avec 0.01€ d'écart ?**
R : Arrondi d'affichage. 0.01€ est toléré.

**Q : Comment importer un plan comptable complet ?**
R : Import CSV depuis Paramètres (futur).

**Q : Les données sont-elles sauvegardées automatiquement ?**
R : Oui, dans Supabase dès validation.

**Q : Puis-je avoir plusieurs sociétés ?**
R : Futur (v1.2).

**Q : Comment faire un backup ?**
R : Export FEC + Export Plan Comptable.

### Questions Comptables

**Q : Débit ou Crédit ?**
R : Règle : Emplois au débit, Ressources au crédit
- Augmentation d'actif → Débit
- Diminution d'actif → Crédit
- Augmentation de passif → Crédit
- Charge → Débit
- Produit → Crédit

**Q : Qu'est-ce qu'un lot équilibré ?**
R : Σ Débits = Σ Crédits

**Q : Pourquoi lettrer ?**
R : Suivre les paiements, identifier les impayés, rapprochement bancaire.

**Q : C'est quoi le FEC ?**
R : Fichier obligatoire pour contrôle fiscal. Export de toutes les écritures.

---

## Dépannage

### Problèmes Courants

#### Problème : L'application ne charge pas

**Solutions**
1. Vérifier que le serveur tourne
   ```bash
   npm run dev
   ```

2. Vérifier le port
   - http://localhost:3000
   - Si 3000 occupé, essayer 3001

3. Vider le cache navigateur
   - Ctrl + Shift + R
   - Ou mode navigation privée

#### Problème : "Lot non équilibré"

**Solutions**
1. Vérifier chaque ligne
   - Tous les montants saisis
   - Pas de ligne vide

2. Calculer manuellement
   - Σ Débits
   - Σ Crédits
   - Différence

3. Arrondir à 2 décimales
   - 150.005 → 150.01
   - Pas plus de précision

#### Problème : Compte non trouvé

**Solutions**
1. Vérifier le numéro
   - 6 chiffres exactement
   - Pas d'espace

2. Créer le compte
   - Si inexistant dans le plan

3. Autocomplétion
   - Utiliser la liste déroulante

#### Problème : Navigation ne fonctionne pas

**Solutions**
1. Vérifier la position
   - En haut ou en bas de section

2. Scroller plus fort
   - Seuil d'accumulation

3. Utiliser alternatives
   - Ctrl+K
   - Barre latérale
   - Flèches clavier

#### Problème : Données non sauvegardées

**Solutions**
1. Vérifier Supabase
   - Variables d'environnement
   - Connexion internet

2. Regarder la console
   - F12 → Console
   - Messages d'erreur

3. Réessayer
   - Bouton "Enregistrer" à nouveau

---

## Conclusion

Vous êtes maintenant prêt à utiliser AS400 Horizontal efficacement !

**Points clés à retenir :**
1. Navigation innovante (scroll vertical)
2. Command Palette (Ctrl+K) pour aller vite
3. Toujours équilibrer vos écritures
4. Valider régulièrement le brouillard
5. Lettrer pour suivre les paiements
6. Éditer les rapports mensuellement
7. Utiliser l'IA pour les questions

**Ressources supplémentaires :**
- README.md : Vue d'ensemble
- FONCTIONNALITES.md : Détails techniques
- RACCOURCIS_CLAVIER.md : Tous les shortcuts

**Support :**
- Assistant IA intégré
- Documentation en ligne
- support@tachockey.fr

---

Bonne comptabilité ! 📊✨

**Version** : 1.0.0
**Date** : 2025-01-08
