# Jeu des puzzles — saisie des codes

- `index.html` : page joueurs (saisie du code, « Participation prise en compte »)
- `admin.html` : back-office (classement en direct, réinitialisation)
- `config.js` : configuration Firebase à compléter
- `database.rules.json` : règles de sécurité de la base
- `setup.json` : les 4 équipes et leurs codes, à importer

## Les codes

| Équipe | Code |
|---|---|
| Rouge | 5093911179 |
| Bleue | 9689174491 |
| Verte | 9453665102 |
| Jaune | 0635812064 |

Pour changer un code ou un nom d'équipe : modifier `setup.json` avant l'import (ou directement dans la console Firebase).

## Mise en place (15 min)

1. **Créer le projet** sur https://console.firebase.google.com (Analytics inutile).
2. **Realtime Database** > Créer une base (région Europe) > mode verrouillé.
3. **Règles** : onglet *Règles* de la base, coller le contenu de `database.rules.json`, Publier.
4. **Compte admin** : *Authentication* > Commencer > activer *E-mail/Mot de passe*. Onglet *Utilisateurs* > Ajouter un utilisateur (ton e-mail + mot de passe). Copier son **UID**.
5. **Données** : dans `setup.json`, remplacer `REMPLACE_PAR_TON_UID` par cet UID. Puis dans la base : menu ⋮ > *Importer JSON* > `setup.json`.
6. **Config web** : *Paramètres du projet* > Vos applications > icône Web `</>` > copier `firebaseConfig` dans `config.js` (vérifier que `databaseURL` est présent).
7. **Mise en ligne** : pousser le dossier sur un dépôt GitHub > Settings > Pages > branche `main`.
   - Joueurs : `https://<compte>.github.io/<depot>/`
   - Toi : `https://<compte>.github.io/<depot>/admin.html`

## Comment c'est sécurisé

- Les codes ne figurent **nulle part dans le code des pages** : ils sont seulement dans la base.
- Un joueur ne peut vérifier qu'un code précis qu'il a tapé ; il ne peut pas lister les codes ni le classement.
- L'heure enregistrée est **l'heure du serveur Firebase** : impossible de tricher sur l'horodatage avec l'horloge de son téléphone.
- Après chaque code faux, la page impose une attente croissante (5 s, 10 s, 20 s… jusqu'à 60 s) pour décourager les essais au hasard.
- Le classement retient la **première** saisie de chaque équipe ; les saisies suivantes ne changent rien.

## Conseil pour le découpage du puzzle

Avec des codes de 10 chiffres, chaque pièce détenue par une autre équipe doit porter **au moins 3 chiffres**. Avec 1 ou 2 chiffres manquants, une équipe pourrait tenter les 10 ou 100 combinaisons possibles au lieu de négocier.

## Le jour J

- Tester la veille avec un code, puis cliquer *Réinitialiser la partie* dans l'admin.
- Afficher l'admin sur un écran à part (ou ton téléphone) : il se met à jour en direct.
- Bouton *Afficher les codes* pour vérifier un code sur place.
