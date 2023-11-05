window.addEventListener('load', () => {

    document.getElementById('back2_main').addEventListener('click', () => {
        window.location.href = '/';
    })

    let socket = io('/drawer');

    document.getElementById('get_words').addEventListener('click', () => {
        socket.emit('getword');

    })

    let word = document.getElementById('drawing_word');
    socket.on('word', (drawData) => {
        console.log(drawData);

        let inWord = "word:" + " " + drawData.word;
        let displayWord = document.createElement('p');
        displayWord.innerHTML = inWord;

        word.appendChild(displayWord);
    })

})

let socket;

function setup() {

    let canvas = document.getElementById('drawing_canvas');
    let myCanvas = createCanvas(600, 600);
    myCanvas.parent(canvas);
    
    socket = io('/drawer');
    
    socket.on('draw', function (obj) {
        console.log(obj);
        drawPos(obj);
    });
}

function mouseDragged() {
    let mousePos = { x: mouseX, y: mouseY };
    socket.emit('draw', mousePos);
}

function drawPos(pos) {
    fill(0,0,0);
    ellipse(pos.x, pos.y, 10, 10);
}

