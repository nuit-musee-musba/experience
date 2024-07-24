import { IsFingerTouchStrategy } from "../touch";

const MAX_RADIUS = 50;
const MIN_RADIUS = 10;

const MAX_RADIUS_RATIO = 1.7;
const MIN_RADIUS_RATIO = 0.5;

export const isFingerTouchByRadius: IsFingerTouchStrategy = (
  touch: Touch
): boolean => {
  const { radiusX, radiusY } = touch;
  const ratio = radiusX / radiusY;

  const isRatioInBounds =
    MIN_RADIUS_RATIO <= ratio && ratio <= MAX_RADIUS_RATIO;
  const isRadiusXInBounds = MIN_RADIUS <= radiusX && radiusX <= MAX_RADIUS;
  const isRadiusYInBounds = MIN_RADIUS <= radiusY && radiusY <= MAX_RADIUS;

  const isOK = isRatioInBounds && isRadiusXInBounds && isRadiusYInBounds;

  isOK
    ? console.log(touch.radiusX, touch.radiusY, ratio)
    : console.warn(touch.radiusX, touch.radiusY, ratio);

  return isOK;
};
