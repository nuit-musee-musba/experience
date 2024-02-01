# Nuit des Musées au MUSBA

## Dévelopment

```bash
# 1. Installer yarn, un meilleur package manager que npm
npm i -g yarn

# 2. Installer les dépendances (à faire régulièrement car les packages peuvent êtres mis à jour)
yarn

# 3. Lancer le serveur de dev
yarn dev
```

## Comment travailler

Pour développer une fonctionnalité, un fix etc, créez une branche depuis `develop`, faites des commits dessus, puis mergez la branche dans `develop`.

Pour envoyer en production, créez une PR pour merger `develop` dans `main`. Une fois mergé, la ci lancera :

- le build du bundle
- le déploiement sur Netlify

**Ce qui est sur `develop` n'est pas en production, ce qui est sur `main` oui !**

### Pourquoi travailler sur develop puis merger sur main ?

- on a une branche de travail et de test (`develop`), et une branche de production (`main`)
- à chaque commit sur `main` un build se lance pour déployer le nouveau bundle et le nouveau site, c'est bien de ne pas lancer un build à chaque commit

## Architecture des dossiers

### À la racine `/src/`

C'est le hub qui amène aux expériences (accessible sur http://localhost:5173/).

### Dans `/src/experiences`

Les expériences, chacune dans son dossier.
Vous avez un exemple dans `experience-template` pour voir comment s'architecture une expérience (accessible sur http://localhost:5173/experiences/experience-template).
**Pensez à ajouter votre dossier dans le fichier `vite.config.js`**

### À la racine `/`

Les fichiers de config

## Tester les builds

### Sur le build en production

- hébergement distant : aller sur https://magical-horse-1ab328.netlify.app/
- hébergement local : récupérer le [dernier bundle.zip de la dernière release](https://github.com/nuit-musee-musba/experience/releases/latest/download/bundle.zip)

### Sur votre propre build

Pas besoin de merger sur main et d'attendre que la ci se termine pour tester votre fonctionnalité en dev :

```bash
# Build le dossier dist pour l'hébergement distant
yarn build

# Build le fichier bundle.zip pour l'hébergement local
yarn bundle
```

### Démarrer le bundle d'hébergement local

1. Récupérer ou build le bundle.zip
2. Unziper le fichier
3. Dans le dossier, éxécuter le script de démarrage correspondant à l'OS (double clic par exemple)
4. Aller sur http://localhost:8080

### Protocoles de tests

- [Tests d'affichage](https://docs.google.com/document/d/1sBZ3sFOpRg8fPJS0sMHI_C1JK4XoqwRLattG3UdXTCM/edit?usp=drive_link)
