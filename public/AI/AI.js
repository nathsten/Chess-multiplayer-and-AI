var startPossition = String();

const chess = new Vue({
    el: "#chessRoot",
    data: {
        gameStarted: false,
        brickSelected: false,
        isMyTurn: false,
        isAITurn: false,
        selectedBrick: String(),
        newBrick: String(),
        brickColor: "black",
        myBrickColor: "white",
        isOnline: false,
        brickIndex: Number(),
        leagalBricks: [],
        playerName: String(),
        myKillList: [],
        opponentKillList: [],
        chats: []
    },
    methods: {
        startNewGame: async () => {
            const getNewGame = await fetch('/newAIGame')
            startPossition = await getNewGame.json();

            const [ topX, bottomX, topY, bottomY, chessBoard ] = $("topX,bottomX,topY,bottomY,chessBoard");
            placeBricks(chessBoard, startPossition, { topX, topY, bottomX, bottomY });
            chess.isMyTurn = true;

            const [ myBricksTaken, opponentBricksTaken ] = $("myBricksTaken,opponentBricksTaken");
            chessBoard.addEventListener("click", brickSelect);
            updateKillList(chess.myKillList, myBricksTaken);
            updateKillList(chess.opponentKillList, opponentBricksTaken);
        }
    }
});

chess.startNewGame();