window.addEventListener('load', () => {

    document.getElementById('back2_main').addEventListener('click', () => {
        window.location.href = '/';
    })

    let socket = io('/respondent');

    let hint = document.getElementById('word_hint')
    socket.on('wordlength', (resData) => {
        //console.log(resData);
        hint.innerText = "hint:" + " " + "number of letters" + " " + resData.wordlength;
    })

    socket.on('clear', () => {
        clear();
    })

})

////////////////////-----p5.js-----////////////////////
let socket;

function setup() {
    let canvas = document.getElementById('drawing_canvas');
    let myCanvas = createCanvas(600, 600);
    myCanvas.parent(canvas);

    socket = io('/respondent');

    //only when drawer clicked 'start' respondent can see the drawing
    socket.on('clear', () => {
        socket.on('draw', function (obj) {
            console.log(obj);
            drawPos(obj);
        });
    })

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
