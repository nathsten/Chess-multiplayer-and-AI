/**
 * @param {string} ids
 * @returns {HTMLElement[]} 
 */
const $ = ids => ids.split(",").map(e => document.getElementById(e));
/**
 * @param {string} el
 * @returns {HTMLElement} 
 */
const new$ = el => document.createElement(el);

class Brick {
    /**
     * @param {{ x: number, y: number }} type 
     * @param {{ x: number, y: number }} possition 
     * @param {HTMLDivElement} div 
     */
    constructor(type, possition, div){
        this.type = type;
        this.possition = possition;
        this.div = div;
    }

    render() {
        const { type, possition, div } = this;
        div.style.backgroundPositionX = `-${type.x * 75}px`;
        div.style.backgroundPositionY = `-${type.y * 75}px`;
        div.style.bottom = `${possition.y * 75 - 75}px`;
        div.style.left = `${possition.x * 75 - 75}px`;
    }
}

const brickScore = {
    "r": 5,
    "p": 1,
    "k": 3,
    "b": 3,
    "Q": 9,
    "K": 10
}

/**
 * @param {HTMLDivElement} div 
 * @param {{ topX: HTMLDivElement, 
 *  topY: HTMLDivElement, 
 *  bottomX: HTMLDivElement, 
 *  bottomY: HTMLDivElement }} axis
*/
const printBoard = (div, axis) => {
    var i, j;
    const { topX, topY, bottomX, bottomY } = axis;
    const letters = "ABCDEFGH";

    for(i = 8; i >= 1; i--){
        for(j = 1; j <= 8; j++){
            if(i === 1){
                const marker = new$("div");
                marker.innerHTML = letters[j-1];
                marker.className = "marker";
                bottomX.append(marker);
            }
            if(i === 8){
                const marker = new$("div");
                marker.innerHTML = letters[j-1];
                marker.className = "marker";
                topX.append(marker);  
            }
            if(j === 1){
                const marker = new$("div");
                marker.innerHTML = i;
                marker.className = "marker";
                topY.append(marker);
            }
            if(j === 8){
                const marker = new$("div");
                marker.innerHTML = i;
                marker.className = "marker";
                bottomY.append(marker);
            }

            const brick = new$("div");
            if(i % 2 !== 0){
                if(j % 2 !== 0){brick.className = "white"}
                else{brick.className = "black"}
            }
            else{
                if(j % 2 === 0){brick.className = "white"}
                else{brick.className = "black"}
            }
            brick.id = `${j}${i}`;
            div.append(brick);
        }
    }
}

/**
 * @param {HTMLDivElement} chessBoard 
 * @param {string} possitions 
 * @param {{ topX: HTMLDivElement, 
 *  topY: HTMLDivElement, 
 *  bottomX: HTMLDivElement, 
 *  bottomY: HTMLDivElement }}
 */
const placeBricks = (chessBoard, possitions, { topX, topY, bottomX, bottomY }) => {
    chessBoard.innerHTML = "";
    topX.innerHTML = "";
    topY.innerHTML = "";
    bottomX.innerHTML = "";
    bottomY.innerHTML = "";
    printBoard(chessBoard, { topX, topY, bottomX, bottomY })
    possitions.split("/").map(e => e.split(","))
    .forEach(([b, p]) => {
        const type = posByType(b);
        const [x, y] = p.match(/(\d+)/).join("").split("").map(e => +e);
        const boardPos = {x,y};
        const div = new$("div");
        const brick = new Brick(type, boardPos, div);
        brick.div.classList.add("brick", b[0]);
        brick.div.id = `${b}${x}${y}`;
        brick.render();
        chessBoard.append(brick.div);
        if(chess.isPlayer2){
            document.querySelectorAll(".brick, .marker")
            .forEach(e => e.classList.add("player2Brick"));
        }
    })
}

/**
 * @param {MouseEvent} e 
 */
const brickSelect = e => {
    if(e.target.className.includes("brick") && (e.target.id.startsWith(chess.brickColor[0])) && chess.isMyTurn){
        if(chess.brickSelected){
            const [ chessBoard, topX, bottomX, topY, bottomY ] = $("chessBoard,topX,bottomX,topY,bottomY");
            placeBricks(chessBoard, startPossition, {topX, topY, bottomX, bottomY});
        }
        const { id } = e.target;
        chess.brickSelected = true;
        chess.selectedBrick = id;
        chess.brickIndex = startPossition.split("/").map(e => e.split(",").join("")).indexOf(id);
        const brickType = id.split("").filter(e => !+e).join("");
        const checkMoves = checkBrickMoves(startPossition, chess.brickIndex, brickType);
        const legalMoves = checkMoves.legalBricks;
        const kill = checkMoves.kill;
        const [ chessBoard ] = $("chessBoard");
        legalMoves.forEach(move => {
            chessBoard.childNodes.forEach(c => {
                if(c.id === String(move.x) + String(move.y)){
                    c.classList.add("legalBrick");
                    if(c.childNodes.length <= 0){
                        const d = new$("div");
                        d.className = "legalBrickIndicator";
                        d.id = c.id;
                        c.append(d);
                    }
                }
            })
        })
        kill.forEach(brick => {
            const { x, y } = brick;
            chessBoard.childNodes.forEach(e => e.id.match(/(\d+)/gm).join("") === `${x}${y}` ? e.classList.add("canKill") : null);
        })
    }
    else if((e.target.className.includes("legalBrick") || e.target.className.includes("legalBrickIndicator")) && chess.brickSelected){
    // if(true){
        const { id } = e.target;
        chess.newBrick = id;
        moveBrick(chess.brickIndex, chess.isOnline);
        chess.brickSelected = false;
        chess.selectedBrick = String();
        chess.brickIndex = Number();
    }
    else if(e.target.className.includes("canKill") && chess.brickSelected){
        const { id } = e.target;
        const newBrickIndex = +id.match(/(\d+)/gm);
        chess.newBrick = newBrickIndex;
        const brickIndex = startPossition.split("/").map(e => e.split(",").join("")).indexOf(id);
        killBrick(brickIndex, chess.myKillList);
        const brickToMove = chess.brickColor === "white" ? chess.brickIndex-1 : chess.brickIndex;
        moveBrick(brickToMove, chess.isOnline);
    }
}

/**
 * @param {number} brickIndex 
 * @param {boolean} online
 */
const moveBrick = (brickIndex, online) => {
    var newStart = startPossition.split("/");
    newStart[brickIndex] = newStart[brickIndex].split(",")[0] + ',' + chess.newBrick;
    startPossition = newStart.join("/");
    var wasMyTurn = chess.isMyTurn;
    // send and recive killList from eachother for every move.
    if(online){
        socket.emit('move', {
            gamePin: chess.gamePin, 
            startPossition, 
            color: chess.brickColor, 
            myKillList: chess.myKillList.join(",")});
    }else {
        const [ chessBoard, topX, bottomX, topY, bottomY ] = $("chessBoard,topX,bottomX,topY,bottomY");
        placeBricks(chessBoard, startPossition, { topX, topY, bottomX, bottomY });    
        const [ myBricksTaken, opponentBricksTaken ] = $("myBricksTaken,opponentBricksTaken");
        updateKillList(chess.myKillList, myBricksTaken);
        updateKillList(chess.opponentKillList, opponentBricksTaken);
    }
    chess.isMyTurn = false;
    const isCheckMate = checkMate(chess.myKillList, chess.brickColor[0]);
    if(isCheckMate){
        if(online) socket.emit('checkMate', {gamePin: chess.gamePin, sender: chess.playerName, chatMsg: "Check mate!"});
        else alert("Check mate!");
        return;
    }
    
    var myBricks = startPossition.split("/").map(e => e.split(",").join("")).filter(e => e.startsWith(chess.brickColor[0]));
    if(chess.isAITurn) myBricks = startPossition.split("/").map(e => e.split(",").join("")).filter(e => e.startsWith("b"));
    const kingInCheck = checkKing(startPossition, myBricks);
    if(kingInCheck.inCheck){
        if(online){
            socket.emit('chatMsg', {gamePin: chess.gamePin, sender: chess.playerName, chatMsg: "Check!"});
        }
        else {
            chess.chats.push({sender: chess.isAITurn ? "AI": "Me", text: "Check!"});
            AIKingInCheck = true;
        }    

    }
    if(!online && wasMyTurn) { chess.isAITurn = true; algorithmicPlayer(startPossition); };
}

/** 
 * @param {string[]} killList 
 * @param {HTMLDivElement} listDiv 
 */
const updateKillList = (killList, listDiv) => {
    listDiv.innerHTML = "";
    killList.forEach(kill => {
        if(kill !== ""){
            const type = posByType(kill);
            const boardPos = {x:1, y: 1};
            const div = new$("div");
            const brick = new Brick(type, boardPos, div);
            brick.div.className = "killedBricks";
            div.style.backgroundPositionX = `-${type.x * 40}px`;
            div.style.backgroundPositionY = `-${type.y * 40}px`;
            listDiv.append(brick.div);
        }
    })
}

/**
 * @param {string} type
 * @returns {{ x: number, y: number }} 
 */
const posByType = type => {
    const pos = {};
    switch(type){
        // black
        case "br": pos.x = 4; pos.y = 1; break;
        case "bk": pos.x = 3; pos.y = 1; break;
        case "bb": pos.x = 2; pos.y = 1; break;
        case "bQ": pos.x = 1; pos.y = 1; break;
        case "bK": pos.x = 0; pos.y = 1; break;
        case "bp": pos.x = 5; pos.y = 1; break;
        // white
        case "wr": pos.x = 4; pos.y = 0; break;
        case "wk": pos.x = 3; pos.y = 0; break;
        case "wb": pos.x = 2; pos.y = 0; break;
        case "wQ": pos.x = 1; pos.y = 0; break;
        case "wK": pos.x = 0; pos.y = 0; break;
        case "wp": pos.x = 5; pos.y = 0; break;
    }
    return pos;
}