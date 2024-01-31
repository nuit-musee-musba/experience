import Experience from "../Experience";
import Environment from "./Environment";

export default class World {
  experience: Experience;
  scene: Experience["scene"];
  resources: Experience["resources"];
  environment: Environment;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    console.log(this.experience);

    this.resources.on("ready", () => {
      this.environment = new Environment();
    });
  }
}
