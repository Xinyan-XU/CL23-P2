window.addEventListener('load', () => {

    let socket = io('/drawer');

    document.getElementById('back2_main').addEventListener('click', () => {
        window.location.href = '/';
    })

    let start = document.getElementById('start');
    let canvas = document.getElementById('drawing_canvas');
    let color = document.getElementById('get_color');

    document.getElementById('get_words').addEventListener('click', () => {
        start.classList.remove('hidden');
        socket.emit('getword');
    })

    let word = document.getElementById('drawing_word');
    socket.on('word', (drawData) => {
        console.log(drawData);
        word.innerText = "The word to draw is: " + drawData.word;
        color.classList.remove('hidden');
    })

    start.addEventListener('click', () => {
        canvas.classList.remove('hidden');
        start.innerText = 'Clear Canvas';
        clear();
    })

})


////////////////////-----p5.js-----////////////////////
let socket;
let p5ColorPicker;
let eraser;

function setup() {
    socket = io('/drawer');

    let canvas = createCanvas(600, 600);
    canvas.parent('drawing_canvas');

    socket.on('draw', function (obj) {
        console.log(obj);
        drawPos(obj);
    });

    let colorPicker = document.getElementById('color_picker');
    p5ColorPicker = createColorPicker('#ed225d');
    p5ColorPicker.parent(colorPicker);

    let eraserButton = document.getElementById('eraser');
    eraserButton.addEventListener('click', () => {
        eraser = !eraser;
        if (eraser) {
            eraserButton.innerText = 'Pen';
        } else {
            eraserButton.innerText = 'Eraser';
        }
    })
}

function mouseDragged() {
    let mousePos = { x: mouseX, y: mouseY };
    socket.emit('draw', mousePos);
}

function drawPos(pos) {
    if (!eraser) {
        fill(p5ColorPicker.color());
        ellipse(pos.x, pos.y, 10, 10);
    } else {
        fill('#ffffff');
        ellipse(pos.x, pos.y, 30, 30);
    }
    noStroke();
}

