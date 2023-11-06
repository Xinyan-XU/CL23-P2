window.addEventListener('load', () => {

    let socket = io();
    socket.on('connect', function () {
        console.log("Connected");
    });

    socket.on('drawButtonDisable', () => {
        let drawButton = document.getElementById('drawer');
        drawButton.disabled = true;
        let reminder = document.getElementById('reminder');
        reminder.innerText = "the drawer position is occupied, you will be a good guesser!! 😎"
    })

    document.getElementById('drawer').addEventListener('click', (click) => {
        console.log("drawer button clicked");
        click.disabled = true;

        socket.emit('drawButtonClicked');
        window.location.href = '/drawer';
    });
    
    document.getElementById('chatroom').addEventListener('click', () => {
        window.location.href = '/respondent';
    })

})