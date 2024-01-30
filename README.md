# Experience

## Dévelopment

``` bash
# Installer les dépendances (à faire régulièrement car les packages peuvent êtres mis à jour)
yarn

# Lancer le serveur de dev
yarn dev
```

## Architecture de travail
### À la racine `/src/`
C'est le hub (accessible sur `http://localhost/`)

### Dans `/src/experiences`
Les expériences, chacune dans son dossier (vous avez le `experience-template`) pour voir comment s'architecture une expérience.

### À la racine `/`
Les fichiers de config

## Comment travailler
Pour développer une fonctionnalité, un fix etc, créez une branche depuis `main`, faites des commits dessus, puis mergez la branche dans `main`.

## Tester le bundle en local
1. Récupérez le [dernier bundle.zip de la dernière release](https://github.com/nuit-musee-musba/experience/releases/latest/download/bundle.zip)
2. Unzipez le fichier
3. Dans le dossier, éxécutez le script de démarrage correspondant à votre OS.


