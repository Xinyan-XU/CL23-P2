window.addEventListener('load', () => {

    let socket = io();
    socket.on('connect', function () {
        console.log("Connected");
    });

    socket.on('drawButtonDisable',()=>{
        let drawButton = document.getElementById('drawer');
        drawButton.disabled = true;
    })

    document.getElementById('chatroom').addEventListener('click', () => {
        window.location.href = '/respondent';
    })

})

function drawerButton(click){
    console.log("drawer button clicked");
    click.disabled = true;

    let socket = io();
    socket.emit('drawButtonClicked');
    window.location.href = '/drawer';
}