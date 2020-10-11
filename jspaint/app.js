const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.querySelectorAll(".color_btn");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");
const cursor = document.getElementById("cursor");
const cursorCircle = cursor.querySelector("circle");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");


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

const undoStack = [];
const redoStack = [];
undoStack.push(canvas.toDataURL());
ctrlRollbackBtns();

function onMouseUp() {
    if (painting) {
        undoStack.push(canvas.toDataURL());
        ctrlRollbackBtns();
    }
    painting = false;
}

function onMouseDown() {
    painting = true;
    if (filling) ctx.fillRect(0, 0, canvas.width, canvas.height);
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

function onClickPallete(event) {
    const bgColor = event.target.style.backgroundColor;

    ctx.strokeStyle = bgColor;
    ctx.fillStyle = bgColor;
    cursorCircle.setAttribute("fill", bgColor);
}

function onRangeChange(event) {
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

function onClickModeBtn() {
    filling = !filling;
    if (filling) mode.innerText = "그리기";
    else mode.innerText = "채우기";
}

function onClickSaveBtn() {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "paint";
    link.click();
}

function undo() {
    if (undoStack.length > 1) {
        redoStack.push(undoStack.pop());
        var img = new Image();
        img.src = undoStack[undoStack.length - 1];
        img.addEventListener("load", () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }, { once: true }
        );
        ctrlRollbackBtns();
    }
}

function redo() {
    if (redoStack.length > 0) {
        undoStack.push(redoStack.pop());
        var img = new Image();
        img.src = undoStack[undoStack.length - 1];
        img.addEventListener("load", () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }, { once: true }
        );
        ctrlRollbackBtns();
    }
}

function onKeyDown(event) {
    if (event.which == 90 && event.ctrlKey) {
        if (event.shiftKey) {
            redo();
        } else {
            undo();
        }
    }
}

function onClickUndoBtn(event) {
    undo();
}

function onClickRedoBtn(event) {
    redo();
}

function ctrlRollbackBtns() {
    undoBtn.disabled = (undoStack.length === 1);
    redoBtn.disabled = (redoStack.length === 0);
}

if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove, {passive : true});
    canvas.addEventListener("mousedown", onMouseDown, {passive : true});
    canvas.addEventListener("mouseup", onMouseUp, {passive : true});
    canvas.addEventListener("mouseleave", onMouseUp, {passive : true});
}

colors.forEach((color) => color.addEventListener("click", onClickPallete, {passive : true}));

if(range)   range.addEventListener("input", onRangeChange, {passive : true});
if(mode)    mode.addEventListener("click", onClickModeBtn, {passive : true});
if(saveBtn) saveBtn.addEventListener("click", onClickSaveBtn, {passive : true});
if(undoBtn) undoBtn.addEventListener("click", onClickUndoBtn, {passive: true});
if(redoBtn) redoBtn.addEventListener("click", onClickRedoBtn, {passive: true});

document.addEventListener("keydown", onKeyDown, {passive : true});
