function handleDragInteraction(dragElementId, targetZoneId) {
    const dragElement = document.getElementById(dragElementId);
    const targetZone = document.getElementById(targetZoneId);
    let initialX, initialY;
    let success = false;

    const dragElementRect = dragElement.getBoundingClientRect();

    initialX = dragElementRect.left;
    initialY = dragElementRect.top;
    //console.log("initialX: "+initialX)
    //console.log("initialY: "+initialY)

    dragElement.addEventListener('touchstart', (e) => {
        const targetZoneRect = targetZone.getBoundingClientRect();
    });

    dragElement.addEventListener('touchmove', (e) => {
        if (!success) {
            e.preventDefault();
            const touch = e.touches[0];
            const currentX = touch.clientX;
            const currentY = touch.clientY;
            dragElement.style.left = currentX + 'px';
            dragElement.style.top = currentY + 'px';
        }
    });

    dragElement.addEventListener('touchend', (e) => {
        const dragElementRect = dragElement.getBoundingClientRect();
        const targetZoneRect = targetZone.getBoundingClientRect();

        if (
            dragElementRect.right >= targetZoneRect.left &&
            dragElementRect.left <= targetZoneRect.right &&
            dragElementRect.bottom >= targetZoneRect.top &&
            dragElementRect.top <= targetZoneRect.bottom
        ) {
            //console.log('element dans la zone');
            dragElement.style.left = targetZoneRect.left + 'px';
            dragElement.style.top = targetZoneRect.top + 'px';
            success = true;
        } else {
            dragElement.style.left = initialX + 'px';
            dragElement.style.top = initialY + 'px';
            //console.log('element pas dans la zone');
        }
    });
}

// ici il faut initialiser les éléments qui vont drag and drop avec leurs identifiants
// handleDragInteraction(draggableElementId,targetElementId)

handleDragInteraction('dragElement', 'targetZone');
handleDragInteraction('dragElement2', 'targetZone2');
