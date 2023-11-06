//Initialize the express 'app' object
let express = require('express');
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

let words = [
  { word: "umbrella" },
  { word: "key" },
  { word: "whale" },
]

io.on("connection",(socket)=>{
  console.log("main page socket connected");

  socket.on('drawButtonClicked',()=>{
    io.emit('drawButtonDisable');
  })
})

let drawer = io.of('/drawer');
let respondent = io.of('/respondent');
let num = 0;

////////////////////-----drawer page-----////////////////////
drawer.on("connection", (socket) => {
  console.log("drawer socket connected: " + socket.id);

  socket.on('getword', () => {
    num = Math.floor(Math.random() * words.length);
    //server send draw word to drawer
    let drawData = { word: words[num].word }
    drawer.emit('word', drawData);

    //server send draw word length to respondent
    let resData = { wordlength: words[num].word.length }
    respondent.emit('wordlength', resData);
  })

  socket.on('draw', (draw) => {
    drawer.emit('draw', draw);
    respondent.emit('draw', draw);
    console.log(draw);
  })

  socket.on('clear_canvas', (clear) => {
    drawer.emit('clear', clear);
    respondent.emit('clear', clear);
  })

})


////////////////////-----respondent page-----////////////////////
respondent.on("connection", (socket) => {
  console.log("chatroom socket connected: " + socket.id);
})