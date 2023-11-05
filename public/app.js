window.addEventListener('load', () => {

    let socket = io();
    socket.on('connect', function () {
        console.log("Connected");
    });

    document.getElementById('drawer').addEventListener('click', () => {
        window.location.href = '/drawer';
    })

    document.getElementById('chatroom').addEventListener('click', () => {
        window.location.href = '/respondent';
    })

})