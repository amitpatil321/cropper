import React, { Component } from 'react';

import { getMouse, drawRect, loadImage, clear, reDrawAll, alreadyOccupied, getDragPoints } from '../utils/utils';
import './cropper.css';

export default class Cropper extends Component {
    rectangles = [];
    componentDidMount() {
        document.querySelector('#overlay').addEventListener('mousedown', this.onMouseDown);
        document.querySelector('#overlay').addEventListener('mousemove', this.onMouseMove);
        document.querySelector('#overlay').addEventListener('mouseup', this.onMouseUp);
        this.canvas = document.getElementById('myCanvas');
        this.overlay = document.getElementById('overlay');
        this.baseCtx = this.canvas.getContext('2d');
        this.ctx = this.overlay.getContext('2d');

        loadImage(this);
    }

    componentWillUnmount(){
        document.querySelector('#overlay').removeEventListener('mousedown', this.onMouseDown);
        document.querySelector('#overlay').removeEventListener('mousemove', this.onMouseMove);
        document.querySelector('#overlay').removeEventListener('mouseup', this.onMouseUp);
    }

    onMouseDown = (event) => {
        this.currentBox = alreadyOccupied(this, event);
        if (this.currentBox.box === -1 && this.currentBox.point === 'outside') {
            this.mouseDown = true;
            this.dragPoints = {};
            this.dragPoints.left = getMouse(event, this.canvas).x;
            this.dragPoints.top = getMouse(event, this.canvas).y;
        } else if (this.currentBox.box !== -1 && this.currentBox.point === 'inside') {
            this.boxDragging = true;
            // Get initial points from where dragging started
            this.lastX = event.clientX;
            this.lastY = event.clientY;
        }
    }
    onMouseMove = (event) => {
        if (this.mouseDown) {
            clear(this)
            this.dragPoints.width = getMouse(event, this.canvas).x - this.dragPoints.left;
            this.dragPoints.height = getMouse(event, this.canvas).y - this.dragPoints.top;

            // this.rectangles.dragPoints = utils.getDragPoints(rectangles[currentBox.box].cords);
            drawRect(this, this.dragPoints);

            reDrawAll(this);
        } else if (this.boxDragging) {
            let rectLeft = event.clientX - this.lastX;
            let rectTop = event.clientY - this.lastY;
            let currBox = this.rectangles[this.currentBox.box];

            // Add box's current left top + mouse location
            rectLeft = rectLeft + currBox.cords.left;
            rectTop = rectTop + currBox.cords.top;

            currBox.cords.top = rectTop;
            currBox.cords.left = rectLeft;
            currBox.dragPoints = getDragPoints(currBox.cords);
            clear(this);
            // Draw old rectangles as well as we have cleared the context
            reDrawAll(this);
            // Now mouse last xy position becomes current position
            this.lastX = event.clientX;
            this.lastY = event.clientY;
        }
    }

    onMouseUp = (event) => {
        if (this.mouseDown) {
            this.rectangles.push({ cords: this.dragPoints, dragPoints: getDragPoints(this.dragPoints) });
        }
        this.mouseDown = false;
        this.boxDragging = false;
    }

    render() {
        return (
            <>
                <canvas id="myCanvas"></canvas>
                <canvas id="overlay"></canvas>
            </>
        )
    }
}
