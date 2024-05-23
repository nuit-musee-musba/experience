import { firstFingerOfEvent } from "@/global/js/touch";
import gsap from "gsap";
import * as THREE from "three";
import {
  Experience,
  experienceFromId,
  indexFromExperience,
  toObjectName,
} from "./experiences";
import {
  CIRCLE,
  avoidEntireTurn,
  experienceFromRotation,
  yRotationFromIndex,
} from "./rotation";
import { DEFAULT_CAMERA_POSITION } from "./scene";

type OnClickFn = (experience: Experience) => any;

type RotationSystemState = {
  rotation: number;
  direction: number;
  velocity: number;
  inititalPointerX: number;
  lastX: number;
  moveX: number;
  isTouching: boolean;
  hasMoved: boolean;
  autoRotate: boolean;
  restartAutoRotateTimeout: NodeJS.Timeout | null;
  snappingAnimation: gsap.core.Tween | null;
  experienceFocused: Experience | null;
  onClickExperienceFn: OnClickFn;
};

const ROTATION_FACTOR = 0.001;
const AUTO_ROTATE_SPEED = 0.002;
const POWER_FACTOR = 0.8;
const DECELERATION = 1;
const MIN_VELOCITY = 0;
const MAX_VELOCITY = 100;
const RESTART_AUTO_ROTATE_AFTER_MS = 5_000;
const SNAP_TIME_SECOND = 1;

export const makeCarousel = ({
  scene,
  camera,
  carouselGroup,
}: {
  scene: THREE.Scene;
  carouselGroup: THREE.Group<THREE.Object3DEventMap>;
  camera: THREE.Camera;
}) => {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const state: RotationSystemState = {
    rotation: 0,
    direction: 1,
    velocity: 0,
    inititalPointerX: 0,
    lastX: 0,
    moveX: 0,
    isTouching: false,
    hasMoved: false,
    autoRotate: true,
    restartAutoRotateTimeout: null,
    snappingAnimation: null,
    experienceFocused: null,
    onClickExperienceFn: (e) =>
      console.warn("showBtn clicked but no action defined"),
  };

  const isMoving = () => state.velocity > 5;

  const isFocusingExperience = () => !!state.experienceFocused;

  const boundVelocity = (velocity: number): number =>
    Math.min(MAX_VELOCITY, Math.max(MIN_VELOCITY, velocity));

  const updateRotation = (delta: number) => {
    state.rotation = (state.rotation + delta) % CIRCLE;
    if (state.rotation < 0) {
      state.rotation += CIRCLE;
    }
  };

  const restartAutoRotateAfterDelay = () => {
    if (state.restartAutoRotateTimeout) {
      clearTimeout(state.restartAutoRotateTimeout);
    }
    state.restartAutoRotateTimeout = setTimeout(() => {
      if (state.experienceFocused) {
        return;
      }
      state.autoRotate = true;
    }, RESTART_AUTO_ROTATE_AFTER_MS);
  };

  const findExperienceFromRaycast = (): Experience | undefined => {
    raycaster.setFromCamera(pointer, camera);

    const intersectedElement = raycaster.intersectObjects(
      scene.children,
      true
    )[0];
    if (intersectedElement?.object?.type !== "Mesh") {
      return;
    }

    const islandElement = intersectedElement.object.parent;
    if (!islandElement) {
      return;
    }

    return experienceFromId(islandElement.userData.id);
  };

  const updateGroupRotation = () => {
    state.velocity = boundVelocity(state.velocity - DECELERATION);

    if (!state.isTouching) {
      if (state.autoRotate) {
        updateRotation(AUTO_ROTATE_SPEED);
      } else {
        updateRotation(state.velocity * state.direction * ROTATION_FACTOR);
        if (state.velocity === 0) {
          snapOnExperience(experienceInFrontOfCarousel());
        }
      }
    }

    carouselGroup.rotation.y = state.rotation;
  };

  const snapOnExperience = (experience: Experience) => {
    if (state.snappingAnimation) {
      return;
    }

    let yRotationTarget = yRotationFromIndex(indexFromExperience(experience));

    if (yRotationTarget === carouselGroup.rotation.y) {
      return;
    }

    yRotationTarget = avoidEntireTurn(
      carouselGroup.rotation.y,
      yRotationTarget
    );

    state.snappingAnimation = gsap.to(state, {
      rotation: yRotationTarget,
      duration: SNAP_TIME_SECOND,
      onComplete() {
        state.snappingAnimation = null;
      },
    });
  };

  const cancelSnap = () => {
    state.snappingAnimation?.kill();
    state.snappingAnimation = null;
  };

  const experienceInFrontOfCarousel = (): Experience =>
    experienceFromRotation(carouselGroup.rotation.y);

  const islandOfExperience = (experience: Experience) => {
    const island = carouselGroup.getObjectByName(toObjectName(experience));
    if (!island) {
      throw new Error(
        `Unable to find island of experience ${experience.name} (${experience.id})`
      );
    }
    return island;
  };

  const focusExperience = (experience: Experience) => {
    state.experienceFocused = experience;

    const island = islandOfExperience(experience);

    gsap.to(island.position, {
      y: 1,
      duration: 1,
    });

    gsap.to(camera.position, {
      x: 0.2,
      y: 1.9,
      z: -3.6,
      duration: 1,
    });
  };

  const unFocusExperience = () => {
    if (!state.experienceFocused) {
      return;
    }

    const island = islandOfExperience(state.experienceFocused);

    gsap.to(island.position, {
      y: 0,
      duration: 1,
    });

    gsap.to(camera.position, {
      x: DEFAULT_CAMERA_POSITION[0],
      y: DEFAULT_CAMERA_POSITION[1],
      z: DEFAULT_CAMERA_POSITION[2],
      duration: 1,
    });

    state.experienceFocused = null;
    state.autoRotate = true;
  };

  const onExperienceClick = (cb: OnClickFn) => {
    state.onClickExperienceFn = cb;
  };

  type Coordinate = { x: number; y: number };

  const handleToucheStart = ({ x, y }: Coordinate) => {
    if (state.experienceFocused) {
      return;
    }
    cancelSnap();

    pointer.x = (x / window.innerWidth) * 2 - 1;
    pointer.y = -(y / window.innerHeight) * 2 + 1;
    state.inititalPointerX = pointer.x;
    state.lastX = x;

    state.isTouching = true;
    state.hasMoved = false;
    state.autoRotate = false;
    state.velocity = 0;
  };

  const handleToucheMove = ({ x, y }: Coordinate) => {
    if (!state.isTouching || state.experienceFocused) {
      return;
    }
    state.isTouching = true;
    state.hasMoved = true;

    state.velocity = Math.abs(state.lastX - x) * POWER_FACTOR;
    state.direction = state.lastX < x ? 1 : -1;
    state.moveX = state.lastX - x;

    if (y < window.innerHeight / 4) {
      state.direction *= -1;
      state.moveX *= -1;
    }

    updateRotation(-state.moveX * ROTATION_FACTOR);

    state.lastX = x;
  };

  const handleToucheEnd = () => {
    if (state.experienceFocused) {
      return;
    }

    state.isTouching = false;

    restartAutoRotateAfterDelay();

    if (state.inititalPointerX !== pointer.x || state.hasMoved) {
      return;
    }

    const experience = findExperienceFromRaycast();
    if (experience?.id === experienceInFrontOfCarousel().id) {
      state.onClickExperienceFn(experience);
    }
  };

  window.addEventListener("touchstart", (event) => {
    const firstFinger = firstFingerOfEvent(event);

    if (!firstFinger) return;

    handleToucheStart({
      x: firstFinger.clientX,
      y: firstFinger.clientY,
    });
  });

  window.addEventListener("mousedown", (event) => {
    handleToucheStart({
      x: event.clientX,
      y: event.clientY,
    });
  });

  window.addEventListener("touchmove", (event) => {
    const firstFinger = firstFingerOfEvent(event);

    if (!firstFinger) {
      return;
    }

    handleToucheMove({
      x: firstFinger.clientX,
      y: firstFinger.clientY,
    });
  });

  window.addEventListener("mousemove", (event) => {
    handleToucheMove({
      x: event.clientX,
      y: event.clientY,
    });
  });

  window.addEventListener("touchend", () => {
    handleToucheEnd();
  });

  window.addEventListener("mouseup", () => {
    handleToucheEnd();
  });

  return {
    isMoving,
    isFocusingExperience,
    experienceInFrontOfCarousel,
    updateGroupRotation,
    focusExperience,
    unFocusExperience,
    onExperienceClick,
  };
};
