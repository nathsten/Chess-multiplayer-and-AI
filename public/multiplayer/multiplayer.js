const socket = io();

// const startPossition = `br,18/bk,28/bb,38/bQ,48/bK,58/bb,68/bk,78/br,88/bp,17/bp,27/bp,37/bp,47/bp,57/bp,67/bp,77/bp,87/wr,11/wk,21/wb,31/wQ,41/wK,51/wb,61/wk,71/wr,81/wp,12/wp,22/wp,32/wp,42/wp,52/wp,62/wp,72/wp,82`;
let startPossition = String();

const chess = new Vue({
    el: "#chessRoot",
    data: {
        gameStarted: false,
        isPlayer2: false,
        brickSelected: false,
        selectedBrick: String(),
        newBrick: String(),
        brickIndex: Number()
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
                    const [ topX, bottomX, topY, bottomY ] = $("topX,bottomX,topY,bottomY");
                    const [ chessBoard, brickBoard, gamePinDiv, statsDiv ] = $("chessBoard,brickBoard,gamePin,stats");
                    gamePinDiv.innerHTML = `Gamepin: ${existingGame.gamePin}`;
                    printBoard(chessBoard, { topX, topY, bottomX, bottomY });
                    placeBricks(chessBoard, startPossition, { topX, topY, bottomX, bottomY });
                    opponentInfo.innerHTML = "Waiting for opponent...";
                    if(existingGame.isPlayer2){
                        chess.isPlayer2 = true;
                        board.classList.add("player2");
                        const bricks = document.querySelectorAll(".brick");
                        bricks.forEach(e => e.classList.add("player2Brick"));
                        const markers = document.querySelectorAll(".marker");
                        markers.forEach(e => e.classList.add("player2Brick"));
                        opponentInfo.innerHTML = `Playing against: ${existingGame.player1}`;
                        statsDiv.classList.add("player2Brick");
                        statsDiv.style.top = "11.5%";
                        socket.emit('player2Joined', existingGame.player2);
                    }
                    chessBoard.addEventListener("click", brickSelect);
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
                    const [ chessBoard, brickBoard, gamePinDiv, opponentInfo ] = $("chessBoard,brickBoard,gamePin,opponentInfo");
                    const [ topX, bottomX, topY, bottomY ] = $("topX,bottomX,topY,bottomY");
                    gamePinDiv.innerHTML = `Gamepin: ${data.gamePin}`;
                    startPossition = data.startPossition
                    printBoard(chessBoard, { topX, topY, bottomX, bottomY });
                    placeBricks(chessBoard, startPossition, { topX, topY, bottomX, bottomY });
                    opponentInfo.innerHTML = "Waiting for opponent...";
                    chessBoard.addEventListener("click", brickSelect);
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
                        opponentInfo.innerHTML = `Playing against: ${data.player1}`;
                        statsDiv.classList.add("player2Brick");
                        statsDiv.style.top = "11.5%";
                        socket.emit('player2Joined', {playerName});
                        chessBoard.addEventListener("click", brickSelect);
                    }, 10);

                }
            })
        }
    }
})
chess.checkActiveGame();

socket.on('player2', data => {
    const { player2Name } = data;
    console.log(player2Name);
})