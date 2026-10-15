# Rapport de contrôle

Contrôles effectués avant livraison :

- 30 exercices présents, IDs 1 à 30 sans doublon.
- Répartition progressive : compréhension, application, conception, missions intégratrices.
- Tous les chemins d'images référencés existent.
- Toutes les illustrations utilisées sont en PNG RGBA avec transparence.
- `app.js` et `data/exercises.js` passent `node --check`.
- Auto-test des réponses de référence : 30/30 passent la logique de validation.
- Vérification des références locales `index.html` : aucun fichier manquant.
- Responsive CSS prévu pour desktop, tablette et mobile.
- `localStorage`, mode révision, indices, correction immédiate en cas d’erreur, solution expliquée et bilan par notion intégrés.
- Nom de l’enseignante cliquable en haut à droite vers le CV en ligne.

Le site ne dépend d'aucune bibliothèque externe ni d'aucun backend.
