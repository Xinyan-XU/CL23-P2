window.addEventListener('load', () => {

    let socket = io('/drawer');

    document.getElementById('back2_main').addEventListener('click', () => {
        window.location.href = '/';
    })
    let getWords = document.getElementById('get_words');
    getWords.addEventListener('click', () => {
        let start = document.getElementById('start');
        let startText = document.getElementById('start_word');
        start.classList.remove('hidden');
        startText.classList.remove('hidden');
        getWords.innerHTML = "CHANGE WORDS";
        start.innerText = 'START';

        socket.emit('getword');
    })

    let word = document.getElementById('drawing_word');
    socket.on('word', (drawData) => {
        //console.log(drawData);
        word.innerText = "The words to draw is: " + drawData.word;
    })

    let chatPPL = document.getElementById('chatPPL_num');
    socket.on('userCounts', (userCount) => {
        chatPPL.innerText = "Guesser: " + userCount.chatPPL;
    })

    let msgInput = document.getElementById("msg-input");
    socket.on('msg', (data) => {
        msgInput.innerHTML = data.name + ":" + data.msg;
    })
})

////////////////////-----p5.js-----////////////////////
let socket;
let p5ColorPicker;
let eraser;
let buttonClicked = true;

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

    let start = document.getElementById('start');
    let startText = document.getElementById('start_word');
    start.addEventListener('click', () => {
        buttonClicked = true;
        socket.emit('clear_canvas');
        start.innerText = 'CLEAR';
        startText.innerText = ' 👈🏼 click to clear the canvas'
    })

    socket.on('clear', () => {
        clear();
    })
}

function mouseDragged() {
    if (buttonClicked) {
        let mousePos = { x: mouseX, y: mouseY };
        let fillColor, ellipseSize;
        if (!eraser) {
            fillColor = p5ColorPicker.value();
            ellipseSize = 10;
        } else {
            fillColor = '#ffffff';
            ellipseSize = 30;
        }
        socket.emit('draw', { pos: mousePos, fill: fillColor, size: ellipseSize });
    }
}

function drawPos(data) {
    let pos = data.pos;
    let color = data.fill;
    let size = data.size;

    console.log(color);

    noStroke();
    fill(color);
    ellipse(pos.x, pos.y, size, size);
}

