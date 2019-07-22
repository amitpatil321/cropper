import * as CONFIG from '../utils/config';
export function loadImage(obj) {
    obj.imageObj = new Image();
    obj.imageObj.style.height = '500';
    obj.imageObj.style.width = '500';
    obj.imageObj.src = './pic.jpg';

    let _this = obj;
    obj.imageObj.onload = function () {
        // set height and width equal to image
        _this.canvas.width = _this.imageObj.naturalWidth;
        _this.canvas.height = _this.imageObj.naturalHeight;
        // _this.canvas.width = 800;
        // _this.canvas.height = 600;
        _this.baseCtx.drawImage(_this.imageObj, 0, 0);

        // change height and width of overlay canvas same as base canvas
        _this.overlay.style.left = _this.canvas.clientX;
        _this.overlay.style.top = _this.canvas.clientY;

        _this.overlay.width = _this.canvas.width;
        _this.overlay.height = _this.canvas.height;

        // Darw overlay canvas
        _this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        // _this.ctx.fillStyle = 'red';
        _this.ctx.fillRect(0, 0, _this.canvas.width, _this.canvas.height);
    };
}

    // Returns mouse x and y minus canvas relative position
export function getMouse(event, canvas) {
    return {
        x: event.clientX - canvas.getBoundingClientRect().left,
        y: event.clientY - canvas.getBoundingClientRect().top
    }
}

    // clear overlay canvas
export function clear(obj) {
    obj.ctx.clearRect(0, 0, obj.overlay.width, obj.overlay.height);
    obj.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    obj.ctx.fillRect(0, 0, obj.canvas.width, obj.canvas.height);
}

export function drawRect(obj, dragPoints) {
    let { left, top, width, height } = dragPoints;
    obj.ctx.save();
    obj.ctx.beginPath();
    obj.ctx.rect(left, top, width, height);
    obj.ctx.setLineDash([3]); // Make borders dashed
    obj.ctx.strokeStyle = CONFIG.LINECOLOR; // Green color
    obj.ctx.lineWidth = 2; // line size
    obj.ctx.stroke(); // draw
    obj.ctx.restore();

    // Bring image up
    bringImageUp(obj, dragPoints);

    // Draw drag points on rectangle
    drawDragPoints(obj.ctx, dragPoints);
}


export function drawDragPoints(ctx, dragPoints) {
    // Draw corner points
    ctx.strokeStyle = CONFIG.LINECOLOR;
    let { tl, bl, br, tr } = getDragPoints(dragPoints);
    ctx.strokeRect(tl.left, tl.top, tl.width, tl.height); //TL
    ctx.strokeRect(bl.left, bl.top, bl.width, bl.height); //BL
    ctx.strokeRect(br.left, br.top, br.width, br.height); //BR
    ctx.strokeRect(tr.left, tr.top, tr.width, tr.height); //TR
}

export function bringImageUp(obj, dragPoints) {
    const { left, top, width, height } = dragPoints;
    obj.ctx.globalAlpha = 1;
    obj.ctx.drawImage(obj.imageObj, left, top, width, height, left, top, width, height);
}

    // Checks if there is a rect exists at clicked point?
export function alreadyOccupied(obj, event) {
    // Return false if no rect available
    if (!obj.rectangles.length) return { box: -1, point: 'outside' };

    for (let index = 0; index < obj.rectangles.length; index++) {
        var left = event.clientX - obj.canvas.offsetLeft;
        var top = event.clientY - obj.canvas.offsetTop;

        // Check if click point
        let rect = { ...obj.rectangles[index] };
        let rectCords = rect.cords;
        // Check if click is inside the box ?
        if (top >= rectCords.top && top <= rectCords.top + rectCords.height && left >= rectCords.left && left <= rectCords.left + rectCords.width) {
            return { box: index, point: 'inside' }; // Selected box
        } else {
            // Check if click is on drag points?
            let { tl, bl, br, tr } = rect.dragPoints;

            if (top >= tl.top && top <= tl.top + tl.height && left >= tl.left && left <= tl.left + tl.width) {
                return { box: index, point: 'tl' };
            } else if (top >= bl.top && top <= bl.top + bl.height && left >= bl.left && left <= bl.left + bl.width) {
                return { box: index, point: 'bl' };
            } else if (top >= tr.top && top <= tr.top + tr.height && left >= tr.left && left <= tr.left + bl.width) {
                return { box: index, point: 'tr' };
            }
            else if (top >= br.top && top <= br.top + br.height && left >= br.left && left <= br.left + bl.width) {
                return { box: index, point: 'br' };
            }
        }
    }
    return { box: -1, point: 'outside' };;
}

export function reDrawAll(obj) {
    obj.rectangles.forEach((each, index) => {
        drawRect(obj, each.cords);
    });
}

export function getDragPoints(dragPoints) {
    if (dragPoints) {
        let { left, top, width, height } = dragPoints;
        let boxSize = CONFIG.DRAG_RECT_SIZE;
        return {
            tl: { left: left - boxSize / 2, top: top - boxSize / 2, width: boxSize, height: boxSize },
            bl: { left: left - boxSize / 2, top: (top + height) - boxSize / 2, width: boxSize, height: boxSize },
            br: { left: (left + width) - boxSize / 2, top: (height + top) - boxSize / 2, width: boxSize, height: boxSize },
            tr: { left: (left + width) - boxSize / 2, top: (top - boxSize) + boxSize / 2, width: boxSize, height: boxSize },
        }
    }
}

// export function onMouseUp() {
//     if (isDragging) {
//         rectangles.push({ cords: dragPoints, dragPoints: utils.getDragPoints({ ...dragPoints }) });
//     }
//     isDragging = false;
//     boxDragging = false;
//     sideDragging = false;
//     side = null;
//     dragPoints = {};
// }