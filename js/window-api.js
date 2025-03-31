window.enableDrag = function (windowElement) {
    let pos = { x: 0, y: 0, top: 0, left: 0 };
    const header = windowElement.querySelector('.window-header');
    if (!header) return;

    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos.x = e.clientX;
        pos.y = e.clientY;
        pos.top = windowElement.offsetTop;
        pos.left = windowElement.offsetLeft;

        // Disable transitions while dragging (feels snappier)
        windowElement.style.transition = 'none';

        document.onmouseup = closeDrag;
        document.onmousemove = dragMove;
    }

    function dragMove(e) {
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;
        windowElement.style.top = (pos.top + dy) + "px";
        windowElement.style.left = (pos.left + dx) + "px";
    }

    function closeDrag() {
        // Re-enable transitions AFTER drag ends
        windowElement.style.transition = '';

        document.onmouseup = null;
        document.onmousemove = null;
    }
};

window.getWindowSize = function () {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    };
};
