# 🚀 Guide de Lancement Rapide

## Méthode 1 : Fichier BAT (Recommandé)

### Double-cliquez simplement sur :
```
lancer-as400.bat
```

Le fichier BAT va :
1. ✅ Vérifier que Node.js est installé
2. ✅ Vérifier que les dépendances sont installées
3. ✅ Installer les dépendances si nécessaire
4. ✅ Lancer le serveur de développement
5. ✅ Ouvrir automatiquement votre navigateur sur http://localhost:3000

### Depuis le Bureau (dossier parent)

Vous pouvez aussi utiliser :
```
C:\Users\gabig\Bureau\AS400 alpha\lancer-as400-horizontal.bat
```

Ce fichier lance automatiquement l'application depuis n'importe où.

## Méthode 2 : Ligne de Commande

### Ouvrir un terminal dans le dossier :
```bash
cd "C:\Users\gabig\Bureau\AS400 alpha\as400-horizontal"
npm run dev
```

### Ouvrir le navigateur :
```
http://localhost:3000
```

## 🛑 Arrêter l'Application

Dans le terminal où l'application tourne :
- Appuyez sur **Ctrl + C**
- Confirmez avec **O** (Oui) ou **Y** (Yes)

## ⚠️ Problèmes Courants

### "Node.js n'est pas installé"
1. Téléchargez Node.js : https://nodejs.org
2. Installez la version LTS (recommandée)
3. Redémarrez le terminal
4. Relancez le fichier BAT

### "Erreur lors de l'installation"
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules
npm install --legacy-peer-deps
```

### "Port 3000 déjà utilisé"
```bash
# Utiliser un autre port
npm run dev -- -p 3001
```

Puis ouvrez : http://localhost:3001

### Le navigateur ne s'ouvre pas automatiquement
Ouvrez manuellement : http://localhost:3000

## 📝 Notes

- **Premier lancement** : Peut prendre 1-2 minutes (installation des dépendances)
- **Lancements suivants** : ~30 secondes (démarrage du serveur)
- **Hot reload** : Les modifications sont automatiquement rechargées
- **Terminal** : Ne fermez pas le terminal tant que vous utilisez l'application

## 🎯 Raccourci Bureau (Optionnel)

Pour créer un raccourci sur votre bureau :

1. **Clic droit** sur `lancer-as400.bat`
2. **Envoyer vers** → **Bureau (créer un raccourci)**
3. **Renommez** le raccourci : "AS400 Comptabilité"
4. **Icône** (optionnel) : Clic droit → Propriétés → Changer l'icône

Maintenant vous pouvez lancer l'application depuis votre bureau !

---

**Bon développement ! 🚀**
