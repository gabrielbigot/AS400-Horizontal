# Configuration Vercel

## Variables d'environnement à configurer sur Vercel

Pour que votre application fonctionne correctement sur Vercel, vous devez configurer la variable d'environnement suivante :

1. Allez sur votre dashboard Vercel
2. Sélectionnez votre projet
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez la variable suivante :

### Variable requise

- **Nom** : `NEXT_PUBLIC_API_URL`
- **Valeur** : L'URL de votre backend déployé sur Render (par exemple : `https://votre-app.onrender.com`)
- **Environnements** : Cochez `Production`, `Preview`, et `Development`

## Après avoir ajouté la variable

1. Sauvegardez la variable
2. Redéployez votre application (ou attendez le prochain déploiement automatique)

## Architecture

- **Frontend** : Déployé sur Vercel (Next.js 15 avec App Router)
- **Backend** : Déployé sur Render (API Express)
- **Communication** : Le frontend appelle directement l'API backend via `NEXT_PUBLIC_API_URL`

## Vérification

Une fois déployé, votre application devrait :
- Afficher correctement la page d'accueil
- Pouvoir communiquer avec l'API backend pour les fonctionnalités comme l'assistant IA
