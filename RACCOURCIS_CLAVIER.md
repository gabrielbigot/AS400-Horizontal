# ⌨️ Guide des Raccourcis Clavier - AS400 Horizontal

Maîtrisez l'application grâce aux raccourcis clavier pour une productivité maximale !

---

## 📑 Table des Matières

1. [Navigation](#navigation)
2. [Command Palette](#command-palette)
3. [Actions Générales](#actions-générales)
4. [Raccourcis par Section](#raccourcis-par-section)
5. [Raccourcis Futurs](#raccourcis-futurs)
6. [Configuration](#configuration)
7. [Cheat Sheet](#cheat-sheet)

---

## Navigation

### Navigation entre Sections

| Raccourci | Action | Description |
|-----------|--------|-------------|
| `←` ou `→` | Naviguer horizontalement | Section précédente / suivante |
| `↑` ou `↓` | Naviguer horizontalement | Section précédente / suivante |
| `Home` | Première section (futur) | Retour au Tableau de Bord |
| `End` | Dernière section (futur) | Aller à Assistant IA |

### Exemples d'Usage

**Parcourir toutes les sections**
```
1. Appuyez sur → plusieurs fois
2. Chaque pression = section suivante
3. Transition fluide 700ms
```

**Retour rapide au Dashboard**
```
1. Ctrl+K
2. Tapez "dash"
3. Entrée
```

**Navigation rapide vers une section spécifique**
```
1. Ctrl+K
2. Tapez le nom (ex: "ecritures")
3. Entrée
```

---

## Command Palette

### Raccourci Principal

| Raccourci | Action |
|-----------|--------|
| `Ctrl + K` | Ouvrir/Fermer Command Palette |
| `Cmd + K` | (Mac) Ouvrir/Fermer Command Palette |

### Navigation dans la Palette

| Raccourci | Action |
|-----------|--------|
| `↑` | Élément précédent |
| `↓` | Élément suivant |
| `Enter` | Sélectionner l'élément |
| `Esc` | Fermer la palette |
| `Backspace` | Effacer la recherche |

### Recherche dans la Command Palette

**Mots-clés supportés :**

| Tapez | Pour aller à |
|-------|--------------|
| `dash`, `tableau`, `bord` | Tableau de Bord |
| `plan`, `compte`, `comptes` | Plan Comptable |
| `journal`, `journaux` | Journaux |
| `ecriture`, `ecritures`, `saisie` | Écritures |
| `brouillard`, `draft`, `validation` | Brouillard |
| `lettrage`, `rapprochement` | Lettrage |
| `rapport`, `balance`, `fec` | Rapports |
| `param`, `config`, `settings` | Paramètres |
| `ia`, `assistant`, `aide` | Assistant IA |

### Exemples de Workflow

**Workflow 1 : Saisir une écriture**
```
Ctrl+K → "ecri" → Enter
→ Vous êtes sur Écritures
```

**Workflow 2 : Consulter la balance**
```
Ctrl+K → "rapp" → Enter → Sélectionner Balance
```

**Workflow 3 : Demander de l'aide**
```
Ctrl+K → "ia" → Enter → Poser votre question
```

---

## Actions Générales

### Interface

| Raccourci | Action | Description |
|-----------|--------|-------------|
| `Esc` | Fermer modal/palette | Ferme tous les overlays |
| `Tab` | Champ suivant | Navigation dans formulaires |
| `Shift + Tab` | Champ précédent | Navigation inverse |
| `Ctrl + Z` | Annuler (futur) | Annule la dernière action |
| `Ctrl + Y` | Rétablir (futur) | Rétablit l'action annulée |

### Raccourcis de Formulaire

| Raccourci | Action | Contexte |
|-----------|--------|----------|
| `Enter` | Valider | Dans un formulaire |
| `Esc` | Annuler | Ferme le formulaire sans sauvegarder |
| `Tab` | Champ suivant | Passe au champ suivant |
| `Shift + Tab` | Champ précédent | Retour au champ précédent |

---

## Raccourcis par Section

### 1. Tableau de Bord

| Raccourci | Action (futur) |
|-----------|----------------|
| `R` | Rafraîchir les données |
| `E` | Exporter en PDF |
| `P` | Imprimer |

### 2. Plan Comptable

| Raccourci | Action (futur) |
|-----------|----------------|
| `Ctrl + N` | Nouveau compte |
| `Ctrl + F` | Focus sur recherche |
| `/` | Focus sur recherche |
| `Enter` | Voir détails du compte (quand sélectionné) |
| `Delete` | Supprimer compte sélectionné |
| `E` | Éditer compte sélectionné |

### 3. Journaux

| Raccourci | Action (futur) |
|-----------|----------------|
| `Ctrl + N` | Nouveau journal |
| `Ctrl + F` | Rechercher journal |
| `1-5` | Filtrer par type (1=AC, 2=VT, 3=BQ, 4=CA, 5=OD) |

### 4. Écritures

| Raccourci | Action (futur) |
|-----------|----------------|
| `Ctrl + N` | Nouvelle écriture |
| `Ctrl + S` | Sauvegarder le lot |
| `Ctrl + L` | Ajouter une ligne |
| `Ctrl + D` | Dupliquer la ligne |
| `Delete` | Supprimer ligne active |
| `↑` / `↓` | Naviguer entre lignes |
| `Tab` | Champ suivant |
| `D` | Basculer en Débit |
| `C` | Basculer en Crédit |

**Workflow rapide d'écriture :**
```
1. Ctrl+N (nouvelle écriture)
2. Choisir journal (Tab)
3. Compte → Tab
4. D ou C → Tab
5. Montant → Tab
6. Libellé → Tab
7. Date → Enter
8. Ctrl+L (ajouter ligne)
9. Répéter 3-7
10. Ctrl+S (sauvegarder)
```

### 5. Brouillard

| Raccourci | Action (futur) |
|-----------|----------------|
| `Space` | Sélectionner/Désélectionner lot |
| `V` | Valider lot sélectionné |
| `Delete` | Supprimer lot sélectionné |
| `Ctrl + A` | Sélectionner tous |
| `Ctrl + Shift + V` | Valider tous |

### 6. Lettrage

| Raccourci | Action (futur) |
|-----------|----------------|
| `Space` | Sélectionner/Désélectionner écriture |
| `L` | Lettrer sélection |
| `U` | Délettrer |
| `Ctrl + A` | Sélectionner tous |
| `A` | Lettrage automatique |

### 7. Rapports

| Raccourci | Action (futur) |
|-----------|----------------|
| `1` | Balance |
| `2` | Grand Livre |
| `3` | FEC |
| `4` | TVA |
| `Ctrl + P` | Imprimer |
| `Ctrl + E` | Exporter PDF |
| `Ctrl + Shift + E` | Exporter CSV |
| `G` | Générer rapport |

### 8. Paramètres

| Raccourci | Action (futur) |
|-----------|----------------|
| `Ctrl + S` | Sauvegarder modifications |
| `Esc` | Annuler modifications |
| `Tab` | Naviguer entre sections |

### 9. Assistant IA

| Raccourci | Action (futur) |
|-----------|----------------|
| `Ctrl + Enter` | Envoyer message |
| `↑` | Message précédent (historique) |
| `↓` | Message suivant (historique) |
| `Ctrl + K` | Effacer conversation |
| `Ctrl + C` | Copier réponse |

---

## Raccourcis Futurs

Ces raccourcis seront implémentés dans les prochaines versions.

### Version 1.1

| Raccourci | Action |
|-----------|--------|
| `Ctrl + N` | Nouvelle écriture (global) |
| `Ctrl + S` | Sauvegarder (global) |
| `Ctrl + F` | Rechercher (global) |
| `Ctrl + P` | Imprimer |
| `/` | Focus barre de recherche |

### Version 1.2

| Raccourci | Action |
|-----------|--------|
| `Ctrl + Shift + N` | Nouvelle fenêtre |
| `Ctrl + T` | Nouvel onglet |
| `Ctrl + W` | Fermer onglet |
| `Ctrl + Tab` | Onglet suivant |
| `Ctrl + Shift + Tab` | Onglet précédent |

### Version 2.0

| Raccourci | Action |
|-----------|--------|
| `Ctrl + Shift + P` | Command Palette avancée |
| `Ctrl + B` | Toggle sidebar |
| `Ctrl + \` | Split view |
| `F11` | Plein écran |
| `Ctrl + +` | Zoom in |
| `Ctrl + -` | Zoom out |
| `Ctrl + 0` | Reset zoom |

---

## Configuration

### Personnaliser les Raccourcis (futur)

1. Aller dans **Paramètres**
2. Section "Raccourcis clavier"
3. Cliquer sur le raccourci à modifier
4. Presser la nouvelle combinaison
5. Sauvegarder

### Import/Export de Configuration (futur)

**Exporter**
```
Paramètres → Raccourcis → Exporter → keyboard-shortcuts.json
```

**Importer**
```
Paramètres → Raccourcis → Importer → Sélectionner fichier
```

### Conflits avec le Navigateur

Certains raccourcis peuvent être interceptés par le navigateur.

**Solutions :**

1. **Mode Application (PWA)**
   - Installer comme app
   - Pas de conflits navigateur

2. **Désactiver les extensions**
   - Extensions peuvent capturer raccourcis
   - Tester en mode incognito

3. **Raccourcis alternatifs**
   - Command Palette toujours disponible
   - Navigation souris fonctionnelle

### Raccourcis Système à Éviter

Ne jamais utiliser ces combinaisons (système) :

| Raccourci | Réservé pour |
|-----------|--------------|
| `Ctrl + W` | Fermer onglet navigateur |
| `Ctrl + T` | Nouvel onglet |
| `Ctrl + N` | Nouvelle fenêtre (navigateur) |
| `Ctrl + Shift + N` | Mode incognito |
| `Alt + F4` | Fermer application |
| `Ctrl + Alt + Delete` | Gestionnaire de tâches |

---

## Cheat Sheet

### Quick Reference

```
┌────────────────────────────────────────────────────────────┐
│              RACCOURCIS AS400 HORIZONTAL                   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  NAVIGATION                                                │
│  ───────────                                               │
│  Ctrl+K          Command Palette                           │
│  ← / →          Section précédente/suivante               │
│  ↑ / ↓          Section précédente/suivante               │
│  Esc             Fermer modal/palette                      │
│                                                            │
│  COMMAND PALETTE                                           │
│  ────────────────                                          │
│  ↑ / ↓          Naviguer dans résultats                   │
│  Enter           Sélectionner                              │
│  Esc             Fermer                                    │
│                                                            │
│  FORMULAIRES                                               │
│  ────────────                                              │
│  Tab             Champ suivant                             │
│  Shift+Tab       Champ précédent                           │
│  Enter           Valider                                   │
│  Esc             Annuler                                   │
│                                                            │
│  FUTURS (v1.1)                                             │
│  ──────────────                                            │
│  Ctrl+N          Nouvelle écriture                         │
│  Ctrl+S          Sauvegarder                               │
│  Ctrl+F          Rechercher                                │
│  /               Focus recherche                           │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Raccourcis par Fréquence d'Usage

**Très Fréquents** (quotidien)
```
Ctrl+K           Ouvrir Command Palette
← / →           Naviguer entre sections
Esc              Fermer modals
```

**Fréquents** (plusieurs fois par jour)
```
Tab              Navigation formulaire
Enter            Valider formulaire
```

**Occasionnels** (hebdomadaire)
```
↑ / ↓           Navigation Command Palette
Shift+Tab        Navigation inverse
```

### Mémorisation par Logique

**Navigation = Flèches**
```
← → ↑ ↓     Déplacement entre sections
```

**Contrôle = Ctrl**
```
Ctrl+K      Command (Kommand)
Ctrl+N      New (futur)
Ctrl+S      Save (futur)
Ctrl+F      Find (futur)
```

**Validation = Enter**
```
Enter       Valider action/formulaire
```

**Annulation = Esc**
```
Esc         Fermer/Annuler
```

---

## Astuces de Productivité

### Workflow Power User

**Matin : Consultation**
```
1. Ouvrir app
2. Dashboard (déjà affiché)
3. Consulter KPIs
4. → pour Plan Comptable
5. → pour voir Journaux
```

**Journée : Saisie intensive**
```
1. Ctrl+K → "ecri"
2. Saisir lot 1
3. Enregistrer
4. Saisir lot 2
5. Enregistrer
...
```

**Soir : Validation**
```
1. Ctrl+K → "brou"
2. Valider tous les lots
3. Ctrl+K → "rapp"
4. Générer balance
```

### Combos Utiles

**Navigation ultra-rapide**
```
Ctrl+K → Tapez → Enter     (3 touches)
VS
Multiple →                 (8+ touches)
```

**Saisie rapide (futur)**
```
Ctrl+N → Tab → Tab → Enter  (Nouvelle écriture en 4 touches)
```

---

## Support

### Aide sur les Raccourcis

**Dans l'application**
1. Appuyer sur `?` (futur)
2. Modal avec tous les raccourcis
3. Recherche de raccourci

**Documentation**
- Ce fichier : RACCOURCIS_CLAVIER.md
- Guide utilisateur : GUIDE_UTILISATEUR.md

### Signaler un Problème

Si un raccourci ne fonctionne pas :
1. Vérifier que focus est sur l'application
2. Tester dans un autre navigateur
3. Désactiver les extensions
4. Signaler sur GitHub Issues

---

## Conclusion

Les raccourcis clavier transforment AS400 Horizontal en outil professionnel ultra-efficace !

**Commencez par maîtriser :**
1. `Ctrl+K` - Command Palette
2. `← →` - Navigation
3. `Esc` - Fermeture

Puis progressivement :
4. Raccourcis de formulaire
5. Raccourcis spécifiques par section

**Gain de productivité estimé :**
- 30% dès la première semaine
- 60% après un mois de pratique
- 80% pour un power user

---

Bonne maîtrise ! ⌨️✨

**Version** : 1.0.0
**Dernière mise à jour** : 2025-01-08
