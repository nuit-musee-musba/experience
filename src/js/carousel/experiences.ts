export const experiences = [
  {
    id: 1,
    path: "/experiences/1-batiment/index.html",
    color: "red",
    title: "Expérience Bâtiment",
    description:
      "Explorez l'histoire du Musée des Beaux-Arts de Bordeaux à travers une mini-carte interactive, depuis sa première installation jusqu'à la construction de son édifice actuel. Cette expérience relève les moments clés qui ont façonné la riche histoire artistique et architecturale de ce lieu emblématique.",
    modelPath: "/5-hub/batiment.glb",
  },
  {
    id: 2,
    path: "/experiences/2-arts-graphiques/index.html",
    color: "blue",
    title: "Expérience Arts Graphiques",
    description:
      "Plongez dans un tourbillon d'aventures où l'art se met en marche sous vos doigts magiques ! Devenez le gardien intrépide des chefs-d'œuvre, naviguant à travers les époques pour les créer, les voir vieillir et les restaurer. Explorez le mystère de la réserve secrète, où les œuvres fatiguées retrouvent leur éclat d'antan.",
    modelPath: "/5-hub/reserve.glb",
  },

  {
    id: 3,
    path: "/experiences/3-sculpture/index.html",
    color: "green",
    title: "Expérience Sculpture",
    description:
      "Entrez dans l’atelier du célèbre sculpteur Rinaldo Carnielo, au cœur de la belle Florence en 1877 ! Votre mission ? Sculpter un bloc de marbre pour restaurer la sculpture “Mozart Expirant”. Dans cette expérience immersive, apprenez l’art de la sculpture et plongez dans l’histoire captivante de Carnielo.",
    modelPath: "/5-hub/sculpture.glb",
  },
  {
    id: 4,
    path: "/experiences/4-lumiere/index.html",
    color: "black",
    title: "Expérience Lumière",
    description:
      "Aventurez-vous dans l’univers captivant de la lumière dans la peinture. Grâce à cette expérience interactive, redécouvrez de célèbres tableaux sous un nouveau jour. En quelques minutes, vous comprendrez l’importance de l’éclairage au fil du temps et des différents courants artistiques.",
    modelPath: "/5-hub/lumiere.glb",
  },
  {
    id: 5,
    path: "/experiences/6-peinture/index.html",
    color: "purple",
    title: "Expérience Peinture",
    description:
      "Plongez dans une aventure artistique captivante en devenant notre disciple. Recevez une commande exclusive du renommé Jan Brueghel de Velours et explorez un univers d'ingrédients, sous la direction de votre maître d'art, Jeff Deuvre. Ensemble, créez une vanité unique et puissante, invitant à méditer sur la beauté éphémère de la vie !",
    modelPath: "/5-hub/peinture.glb",
  },
] as const;

export type Experience = (typeof experiences)[number];
export const indexFromExperience = (experience: Experience): number => {
  return experiences.findIndex((xp) => xp.id === experience.id);
};
export const experienceFromId = (experienceId: number): Experience => {
  const xp = experiences.find((experience) => experience.id === experienceId);

  if (!xp) {
    throw new Error("Unkown experience");
  }

  return xp;
};

export const toObjectName = (experience: Experience) =>
  `experience-${experience.id}`;
