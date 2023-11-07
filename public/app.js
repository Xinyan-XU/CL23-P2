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

    socket.on('userCounts', (userCount)=> {
        let drawerNum = document.getElementById('drawer_num');
        let guesserNum = document.getElementById('guesser_num');
        drawerNum.innerHTML = "Drawer: " + userCount.draw / 2;
        guesserNum.innerHTML = "Guesser: " + userCount.chat / 2;

        if (userCount.draw / 2 == 1) {
            let drawButton = document.getElementById('drawer');
            drawButton.disabled = true;
        }
    });

    socket.emit('getInitialUserCount');

    document.getElementById('drawer').addEventListener('click', (click) => {
        socket.emit('drawButtonClicked');
        window.location.href = '/drawer';
    });

    document.getElementById('chatroom').addEventListener('click', () => {
        window.location.href = '/respondent';
    })

})