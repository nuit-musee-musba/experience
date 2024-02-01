import Experience from "../Experience";
import Environment from "./Environment";
import Painting from "./Painting";

export default class World {
  experience: Experience;
  scene: Experience["scene"];
  resources: Experience["resources"];
  environment: Environment;
  painting: Painting;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    console.log(this.experience);

    this.resources.on("ready", () => {
      this.environment = new Environment();

      this.painting = new Painting(this.experience);
    });
  }
}
