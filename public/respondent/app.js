window.addEventListener('load', () => {

    document.getElementById('back2_main').addEventListener('click', () => {
        window.location.href = '/';
    })

    let socket = io('/respondent');

    let hint = document.getElementById('word_hint')
    socket.on('wordlength', (resData) => {
        //console.log(resData);
        hint.innerText = "HINT: " + resData.wordlength + " words ";
    })

    socket.on('clear', () => {
        clear();
    })

    let chatPPL = document.getElementById('chatPPL_num');
    socket.on('userCounts', (count) => {
        chatPPL.innerText = "Guesser: " + count.chat/2;
    })

    //////////////////////msg section
    ///-----receive socket msg-----/////
    let chatBox = document.getElementById("chat-box-msgs");
    let curMsg;

    socket.on("msg", function (data) {
        console.log("Message arrived");
        console.log(data);

        curMsg = data.msg;

        let receivedMsg = data.name + ": " + data.msg;
        let msgEl = document.createElement("p");
        msgEl.innerHTML = receivedMsg;

        chatBox.appendChild(msgEl);
        chatBox.scrollTop = chatBox.scrollHeight;

        socket.on("get_word", (resAnswer) => {
            console.log("answer checked");
            if (curMsg.toLowerCase() == resAnswer.word.toLowerCase()) {
                console.log("correct guess");
                document.body.style.backgroundColor = 'red';
            } else {
                console.log("incorrect guess")
            };
        })
    })

    //////////------code to send socket message to the server------///////
    let nameInput = document.getElementById('name-input');
    let msgInput = document.getElementById("msg-input");
    let sendButton = document.getElementById("send-button");

    sendButton.addEventListener("click", function () {
        let curName = nameInput.value;
        let curMsg = msgInput.value;
        let msgObj = { "name": curName, "msg": curMsg };

        socket.emit('msg', msgObj);
        socket.emit('get_word');
    });

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
