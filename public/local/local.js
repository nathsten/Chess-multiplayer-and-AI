const chess = new Vue({
    el: "#chessRoot",
    data: {
        gameStarted: false,
        brickSelected: false,
        isMyTurn: false,
        selectedBrick: String(),
        newBrick: String(),
        brickColor: String(),
        brickIndex: Number(),
        leagalBricks: [],
        playerName: String(),
        myKillList: [],
        opponentKillList: []
    },
    methods: {
        
    }
});