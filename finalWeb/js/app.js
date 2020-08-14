import {drawPixels, drawSpray, eraser, fillCanvas, clearCanvas} from './modules/draw-styles.js';
import {sendDataToServer} from './modules/send-to-bucket.js';
import {dragElement} from './modules/drawing-editor.js';
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext("2d");
let rect;
let drawing = false;
let canvasData = {
    mouseX: 0,
    mouseY: 0
};

window.onload = () => {
    const drawingPopUp = document.querySelector('.drawing-popUp');

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    rect = canvas.getBoundingClientRect();

    dragElement(document.querySelector('.stencils'));

    document.querySelectorAll('input[type="range"]').forEach((ranges) => {
        ranges.addEventListener('change',function() {
            this.setAttribute('value', this.value);
        });
    });
};

canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    canvasData.mouseX = e.pageX  - rect.left;
    canvasData.mouseY = e.pageY  - rect.top;
});

canvas.addEventListener('mousemove', (e) => {
    const stencilType = document.querySelector('#stencilType').value;

    if(drawing){
        if(stencilType === 'pencil'){
            drawPixels(ctx, canvasData, e.pageX  - rect.left, e.pageY  - rect.top);
        }
        else if(stencilType === 'spray'){
            drawSpray(ctx, canvasData, e.pageX  - rect.left, e.pageY  - rect.top);
        }
        else if(stencilType === 'eraser'){
            eraser(ctx, canvasData, e.pageX  - rect.left, e.pageY  - rect.top);
        }

        canvasData.mouseX = e.pageX  - rect.left;
        canvasData.mouseY = e.pageY  - rect.top;
    }
});

canvas.addEventListener('mouseup', e => {
    if(drawing){
        canvasData.mouseX = 0;
        canvasData.mouseY = 0;
        drawing = false;
    }
});

document.querySelector('#clearCanvas').addEventListener('click', ()=>{
    clearCanvas(ctx);
});

document.querySelector('#saveCanvas').addEventListener('click', ()=>{
    const canvasURL = canvas.toDataURL('image/jpg');
    const drawingName = document.querySelector('#drawingName').value;

    if(drawingName.length < 1){
        alert('Please add a name');
    }
    else{
        sendDataToServer(drawingName, canvasURL);
    }

});

document.querySelector('#fillCanvas').addEventListener('click', () => {
    fillCanvas(ctx, canvas);
});

const saveToLocal = (name, url) => {
    localStorage.setItem(name, url);
};

const getAllDrawings = () => {
    let drawings = [];
    let keys = Object.keys(localStorage);

    for(let drawing of keys){
        console.log(drawing);
        drawings.push(localStorage.getItem(drawing))
    }

    return drawings;
};