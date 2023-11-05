window.addEventListener('load', () => {

    document.getElementById('back2_main').addEventListener('click', () => {
        window.location.href = '/';
    })

    let socket = io('/respondent');

    let hint = document.getElementById('word_hint')
    socket.on('wordlength', (resData) => {
        console.log(resData);

        let wordLength = "hint:" + " " + "number of letters" + " " + resData.wordlength;
        let displayHint = document.createElement('p');
        displayHint.innerHTML = wordLength;

        hint.appendChild(displayHint);

    })

})

let socket;

function setup() {
    let canvas = document.getElementById('drawing_canvas');
    let myCanvas = createCanvas(600, 600);
    myCanvas.parent(canvas);
    
    socket = io('/respondent');
    
    socket.on('draw', function (obj) {
        console.log(obj);
        drawPos(obj);
    });

}

function drawPos(pos) {
    fill(0, 0, 0);
    ellipse(pos.x, pos.y, 10, 10);
}
