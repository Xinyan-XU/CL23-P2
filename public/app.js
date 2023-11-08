window.addEventListener("load", () => {
    let socket = io();
    socket.on("connect", function () {
        console.log("Connected");
    });

    let reminder = document.getElementById("reminder_occupy");
    let drawButton = document.getElementById("drawer");
    let drawerNum = document.getElementById("drawer_num");
    let guesserNum = document.getElementById("guesser_num");

    //live check on how many users are in both page
    socket.on("userCounts", (userCount) => {
        drawerNum.innerHTML = "Drawer: " + userCount.draw / 2;
        guesserNum.innerHTML = "Guesser: " + userCount.chat / 2;
        //disable the drawer button to make sure there is only one drawer
        if (userCount.draw / 2 == 1) {
            drawButton.disabled = true;
            reminder.innerText =
                "HI THERE!!! The Drawer Position Is Occupied, You Will Be A Good Guesser!! 😎";
        }
    });

    socket.emit("getInitialUserCount");

    document.getElementById("drawer").addEventListener("click", (click) => {
        window.location.href = "/drawer";
    });

    document.getElementById("chatroom").addEventListener("click", () => {
        window.location.href = "/respondent";
    });
});
