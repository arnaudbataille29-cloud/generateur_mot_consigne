# Muse Aléatoire

Application web française qui tire au hasard **une consigne d'écriture** : une forme (poème, récit, dialogue, défi), une contrainte (façon Oulipo), un thème et trois mots imposés. Pensée pour aider à la création de poèmes et de textes.

## Fonctionnalités

- Génération d'une consigne complète en un clic
- Filtrage par catégories : Poésie, Récit, Dialogue, Défi
- Reroll des mots imposés sans changer le reste de la consigne
- Copie de la consigne en un clic
- Historique des 8 dernières consignes (stocké localement dans le navigateur)
- 100 % hors-ligne : aucun serveur, aucune donnée collectée
- Installable sur mobile (PWA) : « Ajouter à l'écran d'accueil »

## Utilisation

Site statique sans dépendance. En local :

```bash
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000

## Déploiement

Le workflow `.github/workflows/pages.yml` publie automatiquement le site sur GitHub Pages à chaque push sur `main` (à activer dans *Settings → Pages → Source : GitHub Actions*).

## Structure

- `index.html` — structure de la page
- `styles.css` — styles responsive (mobile-first)
- `app.js` — logique de génération, filtres, historique
- `data.js` — formes, contraintes, thèmes et 200 mots français (issus de Lexique-383)
- `manifest.webmanifest`, `sw.js`, `icon.svg` — installable PWA et mode hors-ligne
