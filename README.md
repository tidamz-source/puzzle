# Jeu des puzzles : version Google Sheet

Tout tourne dans un Google Sheet avec Apps Script : pas de serveur, pas de compte pour les joueurs, pas d'hébergement à part.

## Fichiers

- `Code.gs` : la logique (vérification des codes, enregistrement, classement)
- `Joueur.html` : page de saisie du code
- `Admin.html` : back-office avec le classement en direct

## Les codes

| Équipe | Code |
|---|---|
| Rouge | 5093911179 |
| Bleue | 9689174491 |
| Verte | 9453665102 |
| Jaune | 0635812064 |

Pour les modifier : bloc `TEAMS` en haut de `Code.gs`.

## Déploiement (10 min)

1. Crée un Google Sheet vide (sheets.new).
2. Menu **Extensions > Apps Script**.
3. Remplace le contenu de `Code.gs` par celui du fichier `Code.gs`.
4. Clique sur **+** à côté de *Fichiers* > **HTML**, nomme-le exactement `Joueur` et colle `Joueur.html`. Pareil avec `Admin` et `Admin.html`.
5. Enregistre (icône disquette).
6. **Déployer > Nouveau déploiement** > roue dentée > **Application Web** :
   - Exécuter en tant que : **Moi**
   - Qui a accès : **Tout le monde**
7. **Déployer**, puis autorise l'accès (Google affiche un avertissement « application non validée » : *Paramètres avancés > Accéder au projet*, c'est normal pour un script perso).
8. Copie l'**URL de l'application Web**.
   - Joueurs : cette URL telle quelle
   - Toi : la même URL suivie de `?admin=Xsm7gR1kRgU`

Si « Tout le monde » n'est pas proposé (compte professionnel restreint), utilise un compte Gmail personnel : sinon les joueurs devront se connecter.

## Après une modification du code

Une modification n'est visible qu'après **Déployer > Gérer les déploiements > crayon > Version : Nouvelle version > Déployer**. L'URL reste la même.

## Fonctionnement

- Les codes ne sont jamais envoyés aux téléphones : un joueur qui fouille la page ne trouve rien.
- L'heure enregistrée est celle des serveurs Google, au millième de seconde.
- Chaque saisie correcte ajoute une ligne dans l'onglet *Participations* du Sheet ; le classement retient la première saisie de chaque équipe.
- Après un code faux, la page impose une attente croissante (5 s, 10 s, 20 s… jusqu'à 60 s).
- Le back-office se met à jour toutes les 2 secondes.

## Le jour J

- Teste la veille avec un code, puis clique sur *Réinitialiser la partie* dans le back-office.
- Avec des codes de 10 chiffres, chaque pièce détenue par une autre équipe doit porter au moins 3 chiffres, sinon le code se devine.
