//Initialize the express 'app' object
let express = require("express");
let app = express();
// app.use(express.json());
app.use("/", express.static("public"));

//Initialize the actual HTTP server
let http = require("http");
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Server listening at port: " + port);
});

//Initialize socket.io
let io = require("socket.io");
io = new io.Server(server);

//idioms
let words = [
  { word: "Break the Ice" },
  { word: "Hit the Hay" },
  { word: "Piece of Cake" },
  { word: "Time Files" },
  { word: "Under the Weather" },
  { word: "Bite the Bullet" },
  { word: "Butterflies in My Stomach" },
  { word: "Get Cold Feet" },
  { word: "Hold Your Horses" },
  { word: "In the Dog House" },
  { word: "Cost an Arm and a Leg" },
  { word: "Cry Over Spilled Milk" },
  { word: "Don't Count Your Chickens Before They Hatch" },
  { word: "Fish Out of Water" },
  { word: "Let the Cat Out of the Bag" },
  { word: "Time Files" },
  { word: "Under the Weather" },
  { word: "Bite the Bullet" },
  { word: "Rain Cats and Dogs" },
  { word: "The Apple of My Eye" },
];

////////////////////-----welcome page-----////////////////////
////////////////////-----welcome page-----////////////////////
////////////////////-----welcome page-----////////////////////
io.on("connection", (socket) => {
  console.log("main page socket connected");
  updatePPL();

  ////////update user count on both pgs
  socket.on("getInitialUserCount", () => {
    updatePPL();
  });
});

let drawer = io.of("/drawer");
let respondent = io.of("/respondent");
let num = 0;
let chatPPL = 0;
let drawPPL = 0;

////////////////////-----drawer page-----////////////////////
////////////////////-----drawer page-----////////////////////
////////////////////-----drawer page-----////////////////////
drawer.on("connection", (socket) => {
  console.log("drawer socket connected: " + socket.id);

  ///////drawer page number count ++
  drawPPL++;
  updatePPL();

  ///////when drawer click get_word bttn
  socket.on("getword", () => {
    num = Math.floor(Math.random() * words.length);
    //server send draw word to drawer
    let drawData = { word: words[num].word };
    drawer.emit("word", drawData);

    //server send draw word length to respondent
    let wordCount = words[num].word.split(" ").length;
    let resData = { wordlength: wordCount };
    respondent.emit("wordlength", resData);
  });

  ///////p5 canvas
  socket.on("draw", (draw) => {
    drawer.emit("draw", draw);
    respondent.emit("draw", draw);
    console.log(draw);
  });

  ////////when drawer click on clear canvas bttn
  socket.on("clear_canvas", (clear) => {
    drawer.emit("clear", clear);
    respondent.emit("clear", clear);
  });

  socket.on("disconnect", () => {
    console.log("drawer socket disconneted: " + socket.id);
    ///////drawer page number count --
    drawPPL--;
    updatePPL();
  });
});

////////////////////-----respondent page-----////////////////////
////////////////////-----respondent page-----////////////////////
////////////////////-----respondent page-----////////////////////
respondent.on("connection", (socket) => {
  console.log("chatroom socket connected: " + socket.id);
  ///////response page number count ++
  chatPPL++;
  updatePPL();

  //recived msg in respondent chatbox
  socket.on("msg", function (data) {
    console.log("Received a 'msg' event");
    console.log(data);
    //send to both pg
    respondent.emit("msg", data);
    drawer.emit("msg", data);
  });

  //send words to respondant page for answer check when chatbox msg send
  socket.on("get_word", () => {
    let resAnswer = { word: words[num].word };
    respondent.emit("get_word", resAnswer);
  });

  socket.on("disconnect", () => {
    console.log("chatroom socket disconneted: " + socket.id);
    ///////drawer page number count --
    chatPPL--;
    updatePPL();
  });
});

//user count function
function updatePPL() {
  let userCount = { draw: drawPPL, chat: chatPPL };
  io.emit("userCounts", userCount);
  drawer.emit("userCounts", userCount);
  respondent.emit("userCounts", userCount);
  console.log(userCount);
}
