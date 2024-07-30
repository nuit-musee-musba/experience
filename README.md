# Nuit des Musées au MusBA

## C'est quoi ?

Une expérience interactive sur l'écran tactile du MusBA qui a eu lieu lors de la **Nuit Européenne des Musées le samedi 18 mai 2024.**
Réalisé par la promotion 2024 du MMI Bordeaux.

## Simulation de l'écran tactile du MusBA

Vous n'avez peut-être pas d'écran 4k de 1m50 x 1m.
Vous pouvez simuler cette qualité sur chrome en ouvrant l'inspecteur d'élément et en définissant une taille d'écran personnalisée: 3840 x 2160 pixels
Tuto vidéo: [tuto-custom-screen.mp4](https://drive.google.com/file/d/13nn7Nf9MTph6T_OHQdIMjQydiNKbts94/view?usp=sharing)

## Développement

```bash
# 1. Installer yarn si vous ne l'avez pas, un meilleur package manager que npm
npm i -g yarn

# 2. Installer les dépendances (à faire régulièrement car les packages peuvent êtres mis à jour)
yarn

# 3. Lancer le serveur de dev
yarn dev
```

## Comment travailler

1. Créez une branche `feature/*` (fonctionnalité) ou `fix/*` (correction de bug) depuis `develop`
2. Faites des commits sur cette branche
3. Mergez la branche dans `develop`
4. Supprimez la branche

## Mettre en production

Pour envoyer en production, créez une PR pour merger `develop` dans `main`.

Une fois mergé, la CI lancera automatiquement :

- le build du bundle
- le déploiement sur Netlify

**Ce qui est sur `main` est en production, ce qui est sur `develop` non !**

### Pourquoi travailler sur develop puis merger sur main ?

- on a une branche de travail et de test (`develop`), et une branche de production (`main`)
- à chaque commit sur `main` un build se lance pour déployer le nouveau bundle et le nouveau site, c'est bien de ne pas lancer un build à chaque commit

## Architecture des dossiers

### À la racine `/src/`

C'est le hub qui amène aux expériences (accessible sur http://localhost:5173/).

### Dans `/src/experiences`

Les expériences, chacune dans son dossier.
**Pensez à ajouter vos fichiers index.html dans la config `vite.config.js` pour qu'ils soient dans le build**

### Dans `/static`

Les fichiers qui ne sont pas traités par vite (donc autre que js et css en gros)
Exemple : image, fichier 3D

### À la racine `/`

Les fichiers de config

## Tester les builds

### Sur le build en production

- hébergement distant : aller sur https://nuit-du-musba.mmibordeaux.com/
- hébergement local : récupérer le [dernier bundle.zip de la dernière release](https://github.com/nuit-musee-musba/experience/releases/latest/download/bundle.zip)

### Sur votre propre build

Pas besoin de merger sur main et d'attendre que la ci se termine pour tester votre fonctionnalité en dev :

```bash
# Build le dossier dist pour l'hébergement distant
yarn build

# Build le dossier bundle/ pour l'hébergement local
yarn bundle

# Ou build le fichier bundle.zip pour l'hébergement local
yarn bundle:zip
```

### Démarrer le bundle d'hébergement local

1. Récupérer ou build le bundle.zip
2. Unziper le fichier
3. Dans le dossier, éxécuter le script de démarrage correspondant à l'OS (double clic par exemple)
4. Aller sur http://localhost:3000

### Protocoles de tests

- [Tests d'affichage](https://docs.google.com/document/d/1sBZ3sFOpRg8fPJS0sMHI_C1JK4XoqwRLattG3UdXTCM/edit?usp=drive_link)
