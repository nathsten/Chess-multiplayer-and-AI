const socket = io();

// const startPossition = `br,18/bk,28/bb,38/bQ,48/bK,58/bb,68/bk,78/br,88/bp,17/bp,27/bp,37/bp,47/bp,57/bp,67/bp,77/bp,87/wr,11/wk,21/wb,31/wQ,41/wK,51/wb,61/wk,71/wr,81/wp,12/wp,22/wp,32/wp,42/wp,52/wp,62/wp,72/wp,82`;
var startPossition = String();

const chess = new Vue({
    el: "#chessRoot",
    data: {
        gameStarted: false,
        isPlayer2: false,
        brickSelected: false,
        isMyTurn: false,
        isOnline: true,
        // type and index of selected brick
        selectedBrick: String(),
        // Index of new brick
        newBrick: String(),
        brickColor: String(),
        // Index of brick in startPossistion
        brickIndex: Number(),
        leagalBricks: [],
        gamePin: String(),
        playerName: String(),
        opponentName: String(),
        chats: [],
        myKillList: [],
        opponentKillList: []
    },
    methods: {
        checkActiveGame: () => {
            fetch('/checkActiveGame')
            .then(data => data.json())
            .then(existingGame => {
                if(existingGame.board){
                    chess.gameStarted = true;
                    return existingGame;
                }
            })
            .then(existingGame => {
                if(existingGame){
                    startPossition = existingGame.board;
                    chess.gamePin = existingGame.gamePin;
                    const [ topX, bottomX, topY, bottomY ] = $("topX,bottomX,topY,bottomY");
                    const [ chessBoard, brickBoard, gamePinDiv, statsDiv, opponentInfo ] = $("chessBoard,brickBoard,gamePin,stats,opponentInfo");
                    gamePinDiv.innerHTML = `Gamepin: ${existingGame.gamePin}`;
                    printBoard(chessBoard, { topX, topY, bottomX, bottomY });
                    placeBricks(chessBoard, startPossition, { topX, topY, bottomX, bottomY });
                    if(existingGame.isPlayer2){
                        chess.isPlayer2 = true;
                        chess.brickColor = "black";
                        board.classList.add("player2");
                        document.querySelectorAll(".brick, .marker")
                        .forEach(e => e.classList.add("player2Brick"));
                        statsDiv.classList.add("player2Brick");
                        socket.emit('player2Joined', existingGame.player2);
                        chess.playerName = existingGame.player2;
                        chess.opponentName = existingGame.player1;
                        chess.myKillList = existingGame.p2Kills.split(",");
                        chess.opponentKillList = existingGame.p1Kills.split(",");
                    }
                    else{
                        chess.brickColor = "white";
                        chess.playerName = existingGame.player1;
                        chess.opponentName = existingGame.player2;
                        chess.isMyTurn = true;
                        chess.myKillList = existingGame.p1Kills.split(",");
                        chess.opponentKillList = existingGame.p2Kills.split(",");
                    }
                    const [ myBricksTaken, opponentBricksTaken ] = $("myBricksTaken,opponentBricksTaken");
                    chessBoard.addEventListener("click", brickSelect);
                    updateKillList(chess.myKillList, myBricksTaken);
                    updateKillList(chess.opponentKillList, opponentBricksTaken);
                    const data = {
                        gamePin: chess.gamePin,
                        playerName: chess.playerName
                    }
                    socket.emit('joinGame', data);
                }
            })
        },
        createNewGame: () => {
            const [ playernameCreate, gamePinInput, playernameJoin ] = $("playernameCreate,gamePin,playernameJoin");
            const playername = String(playernameCreate.value);
            if(playername !== ""){
                chess.gameStarted = true;
                fetch('/createNewGame', {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({playername}),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(res => res.json())
                .then(data => {
                    if(data.msg) {
                        alert(data.msg);
                        chess.gameStarted = false;
                        return;
                    }
                    const [ chessBoard, brickBoard, gamePinDiv, opponentInfo ] = $("chessBoard,brickBoard,gamePin,opponentInfo");
                    const [ topX, bottomX, topY, bottomY ] = $("topX,bottomX,topY,bottomY");
                    gamePinDiv.innerHTML = `Gamepin: ${data.gamePin}`;
                    startPossition = data.startPossition
                    printBoard(chessBoard, { topX, topY, bottomX, bottomY });
                    placeBricks(chessBoard, startPossition, { topX, topY, bottomX, bottomY });
                    chessBoard.addEventListener("click", brickSelect);
                    chess.playerName = data.playername;
                    chess.gamePin = data.gamePin;
                    chess.isMyTurn = true;
                    chess.brickColor = "white";
                })
                .then(() => {
                    const data = {
                        gamePin: chess.gamePin,
                        playerName: chess.playerName
                    }
                    socket.emit('joinGame', data);
                })
            }
            else{
                alert("Please add a playername");
            }
        },
        joinGame: () => {
            const [ playernameCreate, gamePinInput, playernameJoin ] = $("playernameCreate,gamePinInput,playernameJoin");
            const gamePin = String(gamePinInput.value);
            const playerName = String(playernameJoin.value);
            if(gamePin !== "" && playerName !== ""){
                fetch('/joinGame', {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({gamePin, playerName}),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if(data.msg){
                        alert(data.msg);
                    }
                    else{
                        chess.gameStarted = true;
                        chess.isPlayer2 = true;
                        chess.brickColor = "black";
                        chess.playerName = data.playerName;
                        chess.opponentName = data.player1;
                        chess.gamePin = data.gamePin;
                        chess.myKillList = data.p1kills.split(",");
                        chess.opponentKillList = data.p2kills.split(",");
                        startPossition = data.board;
                        setTimeout(() => {
                            const [ board ] = $("board");
                            const [ chessBoard, brickBoard, gamePinDiv, opponentInfo, statsDiv ] = $("chessBoard,brickBoard,gamePin,opponentInfo,stats");
                            const [ topX, bottomX, topY, bottomY ] = $("topX,bottomX,topY,bottomY");
                            gamePinDiv.innerHTML = `Gamepin: ${data.gamePin}`;
                            printBoard(chessBoard, { topX, topY, bottomX, bottomY });
                            placeBricks(chessBoard, startPossition, { topX, topY, bottomX, bottomY });
                            board.classList.add("player2");
                            const bricks = document.querySelectorAll(".brick");
                            bricks.forEach(e => e.classList.add("player2Brick"));
                            const markers = document.querySelectorAll(".marker");
                            markers.forEach(e => e.classList.add("player2Brick"));
                            statsDiv.classList.add("player2Brick");
                            socket.emit('player2Joined', {player2Name: playerName, gamePin: chess.gamePin});
                            chessBoard.addEventListener("click", brickSelect);
                            const [ myBricksTaken, opponentBricksTaken ] = $("myBricksTaken,opponentBricksTaken");
                            updateKillList(chess.myKillList, myBricksTaken);
                            updateKillList(chess.opponentKillList, opponentBricksTaken);
                        }, 10);
                    }
                })
                .then(() => {
                    const data = {
                        gamePin: chess.gamePin,
                        playerName: chess.playerName
                    }
                    socket.emit('joinGame', data);
                })
            }
            else {
                alert("Please fill in gamepin and playername!");
            }
        },
        leaveGame: () => {
            const data = {
                playerName: chess.playerName,
                gamePin: chess.gamePin
            }
            fetch('/leaveGame', {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(() => {
                socket.emit('leaveGame', ({playerName: chess.playerName, gamePin: chess.gamePin, role: chess.isPlayer2}));
            })
            .then(() => location.reload());
        },
        sendChatMsg: () => {
            const [ chatMsgInpt ] = $("chatMsgInpt");
            const chatMsg = String(chatMsgInpt.value);
            socket.emit('chatMsg', {chatMsg, sender: chess.playerName, gamePin: chess.gamePin});
            chatMsgInpt.value = "";
            chatMsgInpt.focus();
        }
    }
})
chess.checkActiveGame();

socket.on('player2', player2Name => {
    if(!chess.isPlayer2){
        chess.opponentName = player2Name;
    }
});

socket.on('playerLeft', playerName => {
    chess.opponentName = '';
    chess.chats.push({sender: "Bot", text: `${playerName.playerName} left the game`});
})

// send and recive killList from each other for every move.
socket.on('newMove', data => {
    const [ chessBoard, topX, bottomX, topY, bottomY ] = $("chessBoard,topX,bottomX,topY,bottomY");
    placeBricks(chessBoard, data.startPossition, { topX, topY, bottomX, bottomY });
    startPossition = data.startPossition;
    if(chess.isPlayer2){
        const [ board ] = $("board");
        board.classList.add("player2");
        document.querySelectorAll(".brick, .marker")
        .forEach(e => e.classList.add("player2Brick"));
    }
    if(data.color !== chess.brickColor) {
        chess.isMyTurn = true;
        chess.opponentKillList = data.killList.split(",");
    }
    else {
        chess.myKillList = data.killList.split(",");
    }

    const [ myBricksTaken, opponentBricksTaken ] = $("myBricksTaken,opponentBricksTaken");
    updateKillList(chess.myKillList, myBricksTaken);
    updateKillList(chess.opponentKillList, opponentBricksTaken);
})

socket.on('incommingChatMsg', data => {
    const { msg, sender } = data;
    chess.chats.push({sender: sender, text: msg});
    const [chatBox] = $("chatBox")
    chatBox.scrollTop = chatBox.scrollHeight;
})

socket.on('isCheckMate', data => {
    const { msg, sender } = data;
    chess.chats.push({sender: sender, text: msg});
    const [chatBox] = $("chatBox")
    chatBox.scrollTop = chatBox.scrollHeight;
    chess.isMyTurn = false;
})