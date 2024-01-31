import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import EventEmitter from "./EventEmitter.js";
import sources from "../sources";

export interface source {
  type: "gltfModel" | "texture";
  path: string;
  name: string;
}

interface loaders {
  gltfLoader?: GLTFLoader;
  textureLoader?: THREE.TextureLoader;
}

type fileType = GLTF | THREE.Texture;

interface TItems {
  [name: string]: fileType;
}

export default class Resources extends EventEmitter {
  sources: source[];
  loaders: loaders = {};
  loaded: number;
  toLoad: number;
  items: TItems;
  constructor(sources: source[]) {
    super();

    this.sources = sources;

    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
  }

  startLoading() {
    // Load each source
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders.gltfLoader?.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "texture") {
        this.loaders.textureLoader?.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source: source, file: fileType) {
    this.items[source.name] = file;

    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}
