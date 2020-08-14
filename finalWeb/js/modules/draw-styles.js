export const drawPixels = (ctx, canvasData, horizontalBounds, verticalBounds) => {
    const color = document.querySelector('input[type="color"]').value;
    const lineWidth = document.querySelector('.st-size').value;

    ctx.strokeStyle = color || '#000000';
    ctx.lineWidth = lineWidth;
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.moveTo(canvasData.mouseX, canvasData.mouseY);
    ctx.lineTo(horizontalBounds, verticalBounds);
    ctx.stroke();
    ctx.closePath();
};

export const drawSpray = (ctx, canvasData, horizontalBounds, verticalBounds) => {
    const color = document.querySelector('input[type="color"]').value;
    const lineWidth = document.querySelector('.st-size').value;

    ctx.fillStyle = color || '#000000';
    ctx.lineWidth = lineWidth;
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.rect(canvasData.mouseX, canvasData.mouseY, 1, 1);

    for (let i = 25; i <= 0; i--) {
        ctx.rect(canvasData.mouseX + Math.random() * 20 - 10,
            canvasData.mouseY + Math.random() * 20 - 10, 1, 1);
        ctx.fill();
    }

    ctx.lineTo(horizontalBounds, verticalBounds);
    ctx.stroke();
    ctx.closePath();
};

export const eraser = (ctx, canvasData, horizontalBounds, verticalBounds) => {
    const eraserSize = document.querySelector('.er-size').value;

    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.clearRect(canvasData.mouseX, canvasData.mouseY, eraserSize, eraserSize);
    ctx.lineTo(horizontalBounds, verticalBounds);
    ctx.stroke();
    ctx.closePath();
}

export const fillCanvas = (ctx, canvas) =>{
    const color = document.querySelector('input[type="color"]').value;

    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

export const imageToCanvas = (ctx, src) => {
    clearCanvas(ctx);
    ctx.drawImage(src, 0, 0);
};

export const clearCanvas = (ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};