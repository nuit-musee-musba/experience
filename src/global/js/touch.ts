const MIN_TOUCH_FORCE = 0.4;

export const isFingerTouch = (touch: Touch): boolean => {
  if (!touch || !(touch instanceof Touch)) {
    return false;
  }

  // Getting value from localstorage permit edition after bundling
  const minTouchForce = Number.parseFloat(
    localStorage.getItem("MIN_TOUCH_FORCE") ?? MIN_TOUCH_FORCE.toString()
  );

  return touch.force >= minTouchForce;
};

export const eventFingers = (event: TouchEvent) => {
  if (!(event.touches instanceof TouchList)) {
    return [];
  }

  const fingers: Array<Touch> = [];

  for (let i = 0, iMax = event.touches.length; i < iMax; i++) {
    if (isFingerTouch(event.touches[i])) {
      fingers.push(event.touches[i]);
    }
  }

  return fingers;
};

export const firstFinger = (event: TouchEvent): Touch | undefined => {
  return eventFingers(event)[0];
};
