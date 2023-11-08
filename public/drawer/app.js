window.addEventListener('load', () => {

    let socket = io('/drawer');

    document.getElementById('back2_main').addEventListener('click', () => {
        window.location.href = '/';
    })

    ////////////////////-----drawing words section-----////////////////////
    ////////////////////-----drawing words section-----////////////////////
    ////////////////////-----drawing words section-----////////////////////
    let drawWords;

    let getWords = document.getElementById('get_words');
    getWords.addEventListener('click', () => {
        getWords.innerHTML = "CHANGE WORDS";

        socket.emit('getword');
    })

    let word = document.getElementById('drawing_word');
    socket.on('word', (drawData) => {
        drawWords = drawData.word;
        word.innerText = "Words to Draw: " + drawWords;
    })

    let chatPPL = document.getElementById('chatPPL_num');
    socket.on('userCounts', (count) => {
        if (count.chat / 2 !== 0) {
            chatPPL.innerText = "Guesser: " + count.chat / 2;
            getWords.disabled = false;
        } else {
            chatPPL.innerText = "Waiting On Guess Participant..."
            getWords.disabled = true;
        }
    })

    ////////////////////-----received msg section-----////////////////////
    ////////////////////-----received msg section-----////////////////////
    ////////////////////-----received msg section-----////////////////////
    let chatBox = document.getElementById("chat-box-msgs");
    let hint2 = document.getElementById('word_hint2');

    socket.on('msg', (data) => {
        let receivedMsg = data.msg;
        let receivedWord = drawWords;

        let receivedMsgLower = receivedMsg.toLowerCase();
        let receivedWordLower = receivedWord.toLowerCase();

        let receivedMsgEl = document.createElement("p");
        receivedMsgEl.innerHTML = data.name + ": " + receivedMsg;

        chatBox.appendChild(receivedMsgEl);
        chatBox.scrollTop = chatBox.scrollHeight;

        if (receivedMsgLower === receivedWordLower) {
            console.log("Correct guess");
            hint2.innerText = data.name + " has Guessed Correctly!!!! Auto Restart in 6 Seconds.";
            document.body.style.backgroundColor = 'red';
            saveCanvas(canvas, 'myCanvas', 'png');
            setTimeout(() => {
                clear();
            }, 6000);
            getWords.innerHTML = "GET NEW WORDS";
            //confetti code
            //const jsConfetti = new JSConfetti();
            //jsConfetti.addConfetti()
        } else {
            console.log("incorrect guess")
        }
    });

})

////////////////////-----p5.js-----////////////////////
////////////////////-----p5.js-----////////////////////
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
    start.addEventListener('click', () => {
        buttonClicked = true;
        socket.emit('clear_canvas');
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

