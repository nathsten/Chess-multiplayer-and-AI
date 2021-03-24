/**
 * @param {number} l 
 * @returns {number}
 */
const rnd = l => Math.floor(Math.random() * l);

// midlertidlig. 
var AIKingInCheck = false;
/**
 * @param {string} possitions 
 */
const algorithmicPlayer = possitions => {
    // List of all bricks [][]
    const allBricks = possitions.split("/").map(e => e.split(","));
    const tsq = allBricks.filter(e => e[0][0] === "b").map(([a,b]) => b);
    // List of all black brick []
    const AIBrick = allBricks.filter(([t, i]) => t[0] === "b");
    // Check if AI is in check
    const kingInCheck = checkKing(startPossition, AIBrick.map(e => e.join("")));

    if(kingInCheck.inCheck || AIKingInCheck) {
        // move king out of check or, protect him with other bricks
        const king = allBricks.filter(e => e[0] === "bK").map(e => e.join(""));
        const kingIndex = allBricks.map(e => e.join("")).indexOf(king.join(""));
        const allKingMoves = checkBrickMoves(startPossition, kingIndex, "bK");
        const kingKill = allKingMoves.kill.filter(e => e.x >= 1 && e.x <= 8 && e.y >= 1 && e.y <= 8 && !tsq.includes(String(e.x) + String(e.y)));
        const kingMoves = allKingMoves.legalBricks.filter(e => e.x >= 1 && e.x <= 8 && e.y >= 1 && e.y <= 8 && !tsq.includes(String(e.x) + String(e.y)));
        
        // Make a function that checks if king moves includes in any of the moves that can be made.
        
        if(kingKill.length > 0){
            // A random brick to kill.
            const kill = kingKill[rnd(kingKill.length)];
            // The new brick current rnd brick will move to and kill
            chess.newBrick = String(kill.x) + String(kill.y);
            // Indexs of all bricks
            const killIndexs = allBricks.map(([t, i]) => [i.split("").map(e => +e)]).filter((n =>  n[0][0] === kill.x && n[0][1] === kill.y))[0][0];
            // Index of killed brick
            const killBrickIndex = allBricks.map(e => e[1]).indexOf(String(killIndexs[0]) + String(killIndexs[1]));
            // Move random brick
            moveBrick(kingIndex, false);
            // Killed selected brick
            killBrick(killBrickIndex, chess.opponentKillList);
            const [ opponentBricksTaken ] = $("opponentBricksTaken");
            updateKillList(chess.opponentKillList, opponentBricksTaken);
            const [ topX, bottomX, topY, bottomY, chessBoard ] = $("topX,bottomX,topY,bottomY,chessBoard");
            placeBricks(chessBoard, startPossition, { topX, topY, bottomX, bottomY });
            // Push type of kill
            // chess.opponentKillList.push()
            chess.isMyTurn = true;
            chess.a = false;
            chess.brickSelected = false;
            AIKingInCheck = false;
            chess.newBrick = Number();
            return;
        }
        else if(kingMoves.length > 0) {
            // new random move
            const move = kingMoves[rnd(kingMoves.length)];
            // The new brick current rnd brick will move
            chess.newBrick = String(move.x) + String(move.y);
            // Move random brick
            moveBrick(kingIndex, false);
            chess.isMyTurn = true;
            chess.isAITurn = false;
            chess.brickSelected = false;
            AIKingInCheck = false;
            chess.newBrick = Number();
            return;
        }
        else {
            // Check if any other bricks can save him.
            AIKingInCheck = false;
        }
        // return;
    }

    // List of all the bricks that can be killed.
    const killList = [];
    const brickKillList = [];

    // If a brick can be killed, chose kille before move
    allBricks.filter(e => e[0][0] === "b").forEach(brick => {
        const index = allBricks.indexOf(brick);
        const kills = checkBrickMoves(possitions, index, brick[0])
        .kill.filter(e => e.x >= 1 && e.x <= 8 && e.y >= 1 && e.y <= 8 && !tsq.includes(String(e.x) + String(e.y)));
        if(kills.length > 0) {
            killList.push(kills);
            for(let b = 0; b < kills.length; b++) brickKillList.push(brick);
        }
    })

    // All white bricks [][]
    const whiteBricks = allBricks.filter(e => e[0][0] === "w");
    // Type and idex of all the killes that can be made []
    const typesAndIdexOfKills = [];
    killList.forEach(killList => {
        killList.forEach(kill => {
            const type = whiteBricks[whiteBricks.map(([t, i]) => i).indexOf(String(kill.x) + String(kill.y))][0];
            typesAndIdexOfKills.push({type, index: String(kill.x) + String(kill.y)})
        })
    })

    try {
        var selectedKill = typesAndIdexOfKills[0];
        var killer = brickKillList[0];
    
        typesAndIdexOfKills.forEach((kill, i) => {
            if(brickScore[kill.type[1]] > brickScore[selectedKill.type[1]]) {
                selectedKill = kill;
                // The brick that executes the kill. Need some fix with index.
                killer = brickKillList[i];
            }
        });

        // Index of the killed brick in startPossition
        const indexOfSelectedKill = allBricks.map(e => e.join("")).indexOf(selectedKill.type + selectedKill.index);
        chess.newBrick = selectedKill.index;
        // Index of killer brick
        const indexOfKiller = allBricks.map(e => e.join("")).indexOf(killer[0] + killer[1]);
        moveBrick(indexOfKiller, false);
        chess.newBrick = selectedKill.index;
        // Killed selected brick
        killBrick(indexOfSelectedKill, chess.opponentKillList);
        const [ opponentBricksTaken ] = $("opponentBricksTaken");
        updateKillList(chess.opponentKillList, opponentBricksTaken);
        const [ topX, bottomX, topY, bottomY, chessBoard ] = $("topX,bottomX,topY,bottomY,chessBoard");
        placeBricks(chessBoard, startPossition, { topX, topY, bottomX, bottomY });
        chess.isMyTurn = true;
        chess.isAITurn = false;
        chess.brickSelected = false;
        chess.newBrick = Number();
        const isCheckMate = checkMate(chess.opponentKillList, "b");
        if(isCheckMate) {
            chess.chats.push({sender: "AI", text: "Check Mate!"});
            chess.isMyTurn = false;
            chess.isAITurn = false;      
            return;
        }
        return;
    }
    catch(e) { };


    /**
     * If the king is not in check, no bricks can kill or any better strategic moves
     * can be made.
     * Pick a random brick and move it. 
     */

    // a random brick[]
    const newBrick = AIBrick[rnd(AIBrick.length)];
    chess.brickSelected = true;

    // Index of new brick in allBricks
    const brickIndex = allBricks.indexOf(newBrick);
    // All the moves and kills the new brick can make
    const allMoves = checkBrickMoves(possitions, brickIndex, newBrick[0]);
    // All the kills the new brick can make
    const kills = allMoves.kill.filter(e => e.x >= 1 && e.x <= 8 && e.y >= 1 && e.y <= 8 && !tsq.includes(String(e.x) + String(e.y)));
    // All the moves the new brick can make
    const moves = allMoves.legalBricks.filter(e => e.x >= 1 && e.x <= 8 && e.y >= 1 && e.y <= 8 && !tsq.includes(String(e.x) + String(e.y)));
    
    // Prioritize kills
    if(kills.length > 0){
        // A random brick to kill.
        const kill = kills[rnd(kills.length)];
        // The new brick current rnd brick will move to and kill
        chess.newBrick = String(kill.x) + String(kill.y);
        // Indexs of all bricks
        const killIndexs = allBricks.map(([t, i]) => [i.split("").map(e => +e)]).filter((n =>  n[0][0] === kill.x && n[0][1] === kill.y))[0][0];
        // Index of killed brick
        const killBrickIndex = allBricks.map(e => e[1]).indexOf(String(killIndexs[0]) + String(killIndexs[1]));
        // Move random brick
        moveBrick(brickIndex, false);
        // Killed selected brick
        killBrick(killBrickIndex, chess.opponentKillList);
        const [ opponentBricksTaken ] = $("opponentBricksTaken");
        updateKillList(chess.opponentKillList, opponentBricksTaken);
        const [ topX, bottomX, topY, bottomY, chessBoard ] = $("topX,bottomX,topY,bottomY,chessBoard");
        placeBricks(chessBoard, startPossition, { topX, topY, bottomX, bottomY });
        // Push type of kill
        // chess.opponentKillList.push()
        chess.isMyTurn = true;
        chess.a = false;
        chess.brickSelected = false;
        chess.newBrick = Number();
        return;
    }
    else if(moves.length > 0) {
        // new random move
        const move = moves[rnd(moves.length)];
        // The new brick current rnd brick will move
        chess.newBrick = String(move.x) + String(move.y);
        // Move random brick
        moveBrick(brickIndex, false);
        chess.isMyTurn = true;
        chess.isAITurn = false;
        chess.brickSelected = false;
        chess.newBrick = Number();
        return;
    }
    else{
        // If the random selector selected a brick with no possible moves:
        // run the function again untill it selects a valid brick. 
        algorithmicPlayer(possitions);
        chess.brickSelected = false;
        return;
    }
}