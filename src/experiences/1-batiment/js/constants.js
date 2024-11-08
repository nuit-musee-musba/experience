const date = new Date();
const actualYear = date.getFullYear();
export const periods = [
  {
    title: "La Création du Musée",
    date: "1801",
    target: { x: -16.7, y: 1.5, z: -16.7 },
    position: { x: -18, y: 0, z: -17 },
    description: [
      "Le musée des Beaux-Arts de Bordeaux est fondé en 1801, devenant le premier musée de la ville.",
      "La Galerie des Beaux-Arts, espace d'exposition temporaire, est intégrée de part et d'autre du jardin du palais Rohan et du cours d'Albret.",
      "Malgré l’aménagement conçu par l’ingénieur de la Ville Richard Bonfin en 1809, la galerie, ouverte le 1er octobre 1810, ne put présenter toutes ses œuvres.",
    ],
    subTitle: [
      "C’est en 1801 que le projet de création commence et devient le premier musée de Bordeaux avec la Galerie des Beaux-Arts, son espace d’exposition temporaire.",
      "Dès lors de l'installation, les locaux n'étaient pas suffisamment adaptés à ses deux missions essentielles : conserver et présenter.",
      "Malgré l’aménagement conçu par l’ingénieur de la Ville en 1809, la galerie, ouverte le 1er octobre 1810, ne put présenter toutes ses œuvres. Pierre Lacour installa le nouveau musée dans l’hôtel de l’ancienne Académie royale.",
    ],
    poiPosition: [{ x: -15, y: 0.7, z: -15 }],
    poiText: [
      {
        title: "Création du musée",
        text: "Plan de l’hôtel de l’ancienne Académie royale, devenu entre-temps bibliothèque publique depuis le 1er mars 1796. Une galerie des peintures fut aménagée et ouverte à la visite. Elle constituait surtout un complément aux élèves de l'École de dessin.",
      },
    ],
    imagePath: ["/1-batiment/images/1801.jpg"],
  },
  {
    title: "Déplacements Successifs et Incendies",
    date: "1832",
    target: { x: 1, y: 0.7, z: 1 },
    position: { x: 2, y: 2, z: 2 },
    description: [
      "Malgré des ajustements en 1809, les déménagements se succèdent, avec des tentatives d'installation dans divers endroits.",
      "Incendies en 1862 et 1870 obligent à des travaux de réfection, déplaçant temporairement la collection dans des structures vulnérables.",
    ],
    subTitle: [
      "Par manque de place, il est décidé en 1832 de transférer la collection complète dans les grands salons du rez-de-chaussée du Palais Royal.",
      "L’architecte municipal élabora en 1858 un projet de musée situé à l’arrière du palais. Aucun des projets n’avança à cette époque puis un premier incendie ravagea le Palais Royal le 13 juin 1862, endommageant quelques peintures.",
      "Les travaux nécessitèrent le déplacement de la collection dans un « local en planches » installé dans le jardin. Provisoire à l’origine, cette structure, vulnérable aux incendies et aux inondations, demeura 8 années !",
    ],
    poiPosition: [{ x: 0.7, y: 0.7, z: -0.7 }],
    poiText: [
      {
        title: "Déplacements Successifs et Incendies",
        text: "Le musée des Beaux-Arts a subi deux incendies au XIXe siècle. Le premier en 1862 a endommagé des peintures, dont celles de Luca Giordano, nécessitant des restaurations. La reconstruction a contraint le déplacement de la collection vers une structure provisoire. En 1870, un second incendie pendant l'occupation militaire a endommagé le fonds ancien, entraînant la perte de dix-sept tableaux...",
      },
    ],
    imagePath: ["/1-batiment/images/1832-incendie.png"],

  },
  {
    title: "Construction du Musée Actuel",
    date: "1875",
    target: { x: 0, y: 1, z: 3.3 },
    position: { x: 1, y: 2, z: 6 },
    description: [
      "Le musée des Beaux-Arts de Bordeaux est fondé en 1801, devenant le premier musée de la ville.",
      "La Galerie des Beaux-Arts, espace d'exposition temporaire, est intégrée de part et d'autre du jardin du palais Rohan et du cours d'Albret.",
    ],
    subTitle: [
      "Le chantier du musée actuel a débuté en avril 1875 avec la pose de la première pierre par le cardinal Donnet et a été achevé en 1881. Un projet d'agrandissement en 1897 n'a pas abouti.",
      "En parallèle, la galerie des Beaux-Arts a été conçue dans les années 1930 et supervisée par l'architecte Jacques Boistel d’Welles.",
      "Les travaux ont débuté en 1936 et se sont achevés en mars 1939 malgré des retards dus à la Seconde Guerre mondiale. Après avoir été utilisée pendant la guerre, la galerie a repris ses activités artistiques en 1947.",
      "C’est en 2001 qu’elle a été restaurée pour se conformer aux normes de sécurité et d'accessibilité.",
    ],
    poiPosition: [
      { x: -0.2, y: 0.7, z: 2.7 },
      { x: 0.1, y: 0.7, z: 2.1 },
    ],
    poiText: [

      {
        title: "Les façades des pavillons du côté du cours d’Albret",
        text: "Les pavillons du cours d'Albret arborent un décor sculpté composé de quatre bustes et deux statues. Louis Coëffard, élève de Maggesi, a créé deux bustes rue Elisée Reclus : l'un représentant Pierre Lacour fils, fondateur du musée, et l'autre dédié à Doucet, ami de Lacour fils et bienfaiteur du musée.<br><br>De plus, Edmond Prévot, élève de Coëffard, a sculpté deux bustes rue Montbazon : l'un dépeignant Dufour-Dubergier, maire de Bordeaux de 1842 à 1848 et donateur d'une collection de tableaux à la ville, et l'autre représentant Charles-Jean-Pierre Fieffé, fils d'un ancien maire de Bordeaux, impliqué dans la création de la société des amis des arts.",
      },
      {
        title: "Façades côté jardin",
        text: "Les pavillons, avec leurs façades côté jardin, offrent un accès majestueux par deux volées de marches.<br>Le soubassement, doté de soupiraux comme observé dans les ailes, soutient une porte d'entrée monumentale encadrée de doubles colonnes ioniques.<br><br>De chaque côté de cette porte, des fenêtres encadrées de pilastres ioniques éclairent l'entrée, tandis qu'un œil-de-bœuf surplombe l'entresol.<br><br>À l'étage, des doubles colonnes corinthiennes mettent en valeur une porte-fenêtre en plein cintre, entourée de fenêtres ornées de frontons triangulaires et de pilastres corinthiens. Contrairement aux ailes du musée, ces pavillons sont abondamment fenêtrés, exprimant ainsi avec solennité l'importance des collections hébergées par le musée.",
      },
    ],
    imagePath: ["/1-batiment/images/1875-1.jpg", "/1-batiment/images/1875-2.jpg"],

  },
  {
    title: "Construction du Musée Actuel",
    date: "1939",
    target: { x: -2, y: 1, z: 4.2 },
    position: { x: 1, y: 1, z: 2 },
    description: [
      "Le musée des Beaux-Arts de Bordeaux est fondé en 1801, devenant le premier musée de la ville.",
      "La Galerie des Beaux-Arts, espace d'exposition temporaire, est intégrée de part et d'autre du jardin du palais Rohan et du cours d'Albret.",
    ],
    subTitle: [
      "Le chantier du musée actuel a débuté en avril 1875 avec la pose de la première pierre par le cardinal Donnet et a été achevé en 1881. Un projet d'agrandissement en 1897 n'a pas abouti.",
      "En parallèle, la galerie des Beaux-Arts a été conçue dans les années 1930 et supervisée par l'architecte Jacques Boistel d’Welles.",
      "Les travaux ont débuté en 1936 et se sont achevés en mars 1939 malgré des retards dus à la Seconde Guerre mondiale. Après avoir été utilisée pendant la guerre, la galerie a repris ses activités artistiques en 1947.",
      "C’est en 2001 qu’elle a été restaurée pour se conformer aux normes de sécurité et d'accessibilité.",
    ],
    poiPosition: [
      { x: -2.4, y: 0.7, z: 4.5 },

    ],
    poiText: [
      {
        title: "Façade de la galerie des Beaux-Arts",
        text: "Le maire Adrien Marquet décida la construction de cette galerie. Elle fut réalisée par l'architecte d'Welles de 1936 à 1939. Sa façade est composée d'une porte monumentale surmontée des armes de la Ville. Vous pourrez admirer à l'intérieur un très bel escalier dont la rampe du XVIIIe siècle fut offerte par la Chambre de Commerce et d'Industrie de Bordeaux.",
      },

    ],
    imagePath: ["/1-batiment/images/1875-3.jpg"],

  },
  {
    title: "Aujourd'hui",
    date: actualYear.toString(),
    target: { x: 0.9, y: 0.7, z: 0.9 },
    position: { x: 6, y: 2, z: 6 },
    description: [
      "Le musée des Beaux-Arts de Bordeaux continue de jouer un rôle majeur dans la vie culturelle de la ville, présentant des collections permanentes dans les ailes construites par Burguet.",
      "La galerie des Beaux-Arts continue d'accueillir des expositions temporaires, maintenant conformes aux normes de sécurité et d'accessibilité contemporaines.",
    ],
    subTitle: [
      "Le musée des Beaux-Arts de Bordeaux continue de jouer un rôle majeur dans la vie culturelle de la ville, présentant des collections permanentes.",
      "La galerie des Beaux-Arts continue d'accueillir des expositions temporaires, maintenant conformes aux normes de sécurité et d'accessibilité contemporaines.",
    ],
    poiPosition: [
      { x: 0.9, y: 0.7, z: 2.7 },
      { x: 2.4, y: 0.7, z: 0.9 },
    ],
    poiText: [
      {
        title: "1- Le portail",
        text: "Les trois portails qui s'ouvrent sur le cours d'Albret forment un ensemble, avec le portail central qui se distingue par son élaboration particulière. Ce dernier présente les éléments suivants : une couronne comtale, l'écusson de la ville, une abondance de motifs variés tels que des dauphins, des coquillages, des lions, des guirlandes de raisins, etc.",
      },
      {
        title: "2- Bâtiment",
        text: "Le bâtiment est constitué de deux ailes parallèles avec des pavillons donnant sur les jardins.",
      },
    ],
    imagePath: ["/1-batiment/images/2024.jpg"],

  },
];

export const onboardingContent = [
  {
    subTitle: "Bienvenue au musée des Beaux-Arts de Bordeaux, connaissez-vous l’histoire de ce bâtiment ?",
    mainTitle: "Bienvenue dans l’histoire du musée",
  },
  {
    title: "2024",
    subTitle: "Cette expérience vous permet de naviguer à travers les moments clés qui ont façonné la riche histoire artistique et architecturale de ce lieu emblématique.",
    mainTitle: "De sa première installation jusqu'à la construction",
  },
  {
    title: "1801",
    subTitle: "Pour cela, faisons un saut dans le passé… je vous prie de bien vouloir lancer l’expérience.",
    mainTitle: "De sa première installation jusqu'à la construction",
  },
];
