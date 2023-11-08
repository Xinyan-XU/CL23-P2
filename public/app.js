window.addEventListener('load', () => {

    let socket = io();
    socket.on('connect', function () {
        console.log("Connected");
    });

    let reminder = document.getElementById('reminder_occupy');
    let drawButton = document.getElementById('drawer');
    let drawerNum = document.getElementById('drawer_num');
    let guesserNum = document.getElementById('guesser_num');
    socket.on('userCounts', (userCount) => {
        drawerNum.innerHTML = "Drawer: " + userCount.draw / 2;
        guesserNum.innerHTML = "Guesser: " + userCount.chat / 2;

        if (userCount.draw / 2 == 1) {
            drawButton.disabled = true;
            reminder.innerText = "the drawer position is occupied, you will be a good guesser!! 😎"
        }
    });

    socket.emit('getInitialUserCount');
    socket.on('requestClick', () => {
        socket.emit('startClicked');
    })

    document.getElementById('drawer').addEventListener('click', (click) => {
        socket.emit('drawButtonClicked');
        window.location.href = '/drawer';
    });

    document.getElementById('chatroom').addEventListener('click', () => {
        window.location.href = '/respondent';
    })

})