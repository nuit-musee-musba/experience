import { Experience, experiences } from "./experiences";

export const yRotationFromIndex = (index: number) => {
  if (index === 0) {
    return 0;
  }

  return (Math.PI * 2) / (experiences.length / index);
};

export const ROTATION_FOR_EACH_INDEX = experiences.map((_, index) =>
  yRotationFromIndex(index)
);
export const ROTATION_TRESHOLD = Math.PI / experiences.length;
export const CIRCLE = Math.PI * 2;

export const indexFromYRotation = (yRotation: number) => {
  for (let i = 0; i < ROTATION_FOR_EACH_INDEX.length; i++) {
    const rotMin = ROTATION_FOR_EACH_INDEX[i] - ROTATION_TRESHOLD;
    const rotMax = ROTATION_FOR_EACH_INDEX[i] + ROTATION_TRESHOLD;
    if (rotMin <= yRotation && yRotation <= rotMax) {
      return i;
    }
  }
  return 0;
};

export const experienceFromRotation = (rotation: number): Experience => {
  return experiences[indexFromYRotation(rotation)];
};

export const avoidEntireTurn = (
  sourceRotation: number,
  targetRotation: number
) => {
  const distance = sourceRotation - targetRotation;

  if (distance < -ROTATION_TRESHOLD) {
    return targetRotation - CIRCLE;
  }

  if (distance > ROTATION_TRESHOLD) {
    return targetRotation + CIRCLE;
  }

  return targetRotation;
};
