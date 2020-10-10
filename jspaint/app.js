const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.querySelectorAll(".controls_color_btn");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const svaeBtn = document.getElementById("jsSave");
const cursor = document.getElementById("cursor");
const cursorCircle = cursor.querySelector("circle");

const INITIAL_COLOR = "#2c2c2c";
let LINE_WIDTH = 2.5;

canvas.width = 700;
canvas.height = 700;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = INITIAL_COLOR;
ctx.lineWidth = LINE_WIDTH;
ctx.fillStyle = INITIAL_COLOR;

let filling = false;
let painting = false;

function stopPainting() {
    painting = false;
}

function startPainting() {
    painting = true;
}

function onMouseMove(event) {
    const offsetX = event.offsetX;
    const offsetY = event.offsetY;
    const clientX = event.clientX;
    const clientY = event.clientY;

    cursor.style.left = clientX - LINE_WIDTH / 2;
    cursor.style.top = clientY - LINE_WIDTH / 2;

    if (!painting) {
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
    } else {
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    }
}

function handleColorClick(event) {
    const bgColor = event.target.style.backgroundColor;

    ctx.strokeStyle = bgColor;
    ctx.fillStyle = bgColor;
    cursorCircle.setAttribute("fill", bgColor);
}

function handleRangeChange(event) {
    // update line width
    LINE_WIDTH = event.target.value;
    ctx.lineWidth = LINE_WIDTH;

    // update cursor
    cursor.setAttribute("width", LINE_WIDTH);
    cursor.setAttribute("height", LINE_WIDTH);
    cursorCircle.setAttribute("cx", LINE_WIDTH / 2);
    cursorCircle.setAttribute("cy", LINE_WIDTH / 2);
    cursorCircle.setAttribute("r", LINE_WIDTH / 2);
}

function handleModeClick() {
    filling = !filling;
    if (filling) mode.innerText = "그리기";
    else mode.innerText = "채우기";
}

function handleCanvasClick() {
    if (filling) ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function handleCM(event) {
    event.preventDefault();
}

function handleSaveClick() {
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "paint";
    link.click();
}

if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("contextmenu", handleCM);
}

colors.forEach((color) => color.addEventListener("click", handleColorClick));

if (range) {
    range.addEventListener("input", handleRangeChange);
}

if (mode) {
    mode.addEventListener("click", handleModeClick);
}

if (svaeBtn) {
    svaeBtn.addEventListener("click", handleSaveClick);
}
