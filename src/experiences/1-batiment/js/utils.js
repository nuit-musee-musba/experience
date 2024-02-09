import { config, scene } from "./scene";

export const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.material.envMapIntensity = config.envMapIntensity;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};
