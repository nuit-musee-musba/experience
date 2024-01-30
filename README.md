# Experience

## Dévelopment

```bash
# Installer les dépendances (à faire régulièrement car les packages peuvent êtres mis à jour)
yarn

# Lancer le serveur de dev
yarn dev
```

## Architecture de travail

### À la racine `/src/`

C'est le hub qui amène aux expériences (accessible sur http://localhost/).

### Dans `/src/experiences`

Les expériences, chacune dans son dossier.
Vous avez un exemple dans `experience-template` pour voir comment s'architecture une expérience (accessible sur http://localhost/experiences/experience-template/index.html).

### À la racine `/`

Les fichiers de config

## Comment travailler

Pour développer une fonctionnalité, un fix etc, créez une branche depuis `develop`, faites des commits dessus, puis mergez la branche dans `develop`.

Pour envoyer en production, mergez develop dans `main`. Ça lancera le build du bundle, et déploira sur les serveur.

## Tester le bundle en local

1. Récupérer le [dernier bundle.zip de la dernière release](https://github.com/nuit-musee-musba/experience/releases/latest/download/bundle.zip)
2. Unziper le fichier
3. Dans le dossier, éxécuter le script de démarrage correspondant à l'OS.
4. Aller sur http://localhost:8080
