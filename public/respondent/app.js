window.addEventListener("load", () => {
    document.getElementById("back2_main").addEventListener("click", () => {
        window.location.href = "/";
    });

    let socket = io("/respondent");

    ////////////////////-----from drawer-----////////////////////
    ////////////////////-----from drawer-----////////////////////
    ////////////////////-----from drawer-----////////////////////
    //getting words and clue when drawer started the game
    let hint = document.getElementById("word_hint");
    socket.on("wordlength", (resData) => {
        //console.log(resData);
        hint.innerText =
            "The Drawer Has Started the Game! " +
            "HINT: Idiom " +
            resData.wordlength +
            " Words ";
        hint2.innerText = "";
    });

    //canvas clear when drawer clear the canvas
    socket.on("clear", () => {
        clear();
    });

    //get hint & msgs when enter the game after game started
    let chatPPL = document.getElementById("chatPPL_num");
    socket.on("userCounts", (count) => {
        if (count.chat / 2 == 1) {
            chatPPL.innerText =
                "Hi, you are doing a solo guess. Don't worry, there will be a hint. 😉";
        } else {
            chatPPL.innerText =
                "You are with " + (count.chat - 2) / 2 + " other Guesser(s)";
        }
    });

    ////////////////////-----msg section-----////////////////////
    ////////////////////-----msg section-----////////////////////
    ////////////////////-----msg section-----////////////////////
    let chatBox = document.getElementById("chat-box-msgs");
    let nameInput = document.getElementById("name-input");
    let msgInput = document.getElementById("msg-input");
    let sendButton = document.getElementById("send-button");
    let hint2 = document.getElementById("word_hint2");
    let curMsg;

    //send msg from server and show in the chatbox & request answer
    sendButton.addEventListener("click", function () {
        let curName = nameInput.value;
        let curMsg = msgInput.value;
        let msgObj = { name: curName, msg: curMsg };

        if (nameInput.value.trim() !== "" && msgInput.value !== "") {
            socket.emit("msg", msgObj);
            socket.emit("get_word");
        }
        msgInput.value = "";
    });

    //receive msg from server and show in the chatbox
    socket.on("msg", function (data) {
        console.log("Message arrived");
        console.log(data);

        curMsg = data.msg;

        let receivedMsg = data.name + ": " + data.msg;
        let msgEl = document.createElement("p");
        msgEl.innerHTML = receivedMsg;

        chatBox.appendChild(msgEl);
        chatBox.scrollTop = chatBox.scrollHeight;

        //check answers after receive chatbox msg
        socket.on("get_word", (resAnswer) => {
            console.log("answer checked");
            if (curMsg.toLowerCase() == resAnswer.word.toLowerCase()) {
                console.log("correct guess");
                hint2.innerText =
                    data.name +
                    " has Guessed Correctly!!!! Waiting for Drawer to Get New Words...";
                //saveCanvas(canvas, "myCanvas", "png");

                //confetti code
                const jsConfetti = new JSConfetti();
                jsConfetti.addConfetti();

                //music
                //music
                const SuccessSound = new Audio(
                    "https://codeskulptor-demos.commondatastorage.googleapis.com/descent/gotitem.mp3"
                );
                SuccessSound.play();
            } else {
                console.log("incorrect guess");
            }
        });
    });
});

////////////////////-----p5.js-----////////////////////
////////////////////-----p5.js-----////////////////////
////////////////////-----p5.js-----////////////////////
let socket;

function setup() {
    let canvas = document.getElementById("drawing_canvas");
    let myCanvas = createCanvas(600, 600);
    myCanvas.parent(canvas);

    socket = io("/respondent");

    socket.on("draw", function (obj) {
        console.log(obj);
        drawPos(obj);
    });
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
