/**
 * @param {number} l 
 * @returns {number}
 */
const rnd = l => Math.floor(Math.random() * l);

/**
 * @param {string} possitions 
 */
const pickRandomBrick = (possitions) => {
    // List of all bricks [][]
    const allBricks = possitions.split("/").map(e => e.split(","));
    // List of all black brick []
    const AIBrick = allBricks.filter(([t, i]) => t[0] === "b");
    // a random brick[]
    const newBrick = AIBrick[rnd(AIBrick.length)];
    chess.brickSelected = true;
    // Index of new brick in allBricks
    const brickIndex = allBricks.indexOf(newBrick);
    // All the moves and kills the new brick can make
    const allMoves = checkBrickMoves(possitions, brickIndex, newBrick[0]);
    // All the kills the new brick can make
    const kills = allMoves.kill.filter(e => e.x >= 1 && e.x <= 8 && e.y >= 1 && e.y <= 8);
    // All the moves the new brick can make
    const moves = allMoves.legalBricks.filter(e => e.x >= 1 && e.x <= 8 && e.y >= 1 && e.y <= 8);

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
        killBrick(killBrickIndex, chess.myKillList);
        // Push type of kill
        // chess.opponentKillList.push()
        chess.isMyTurn = true;
        chess.isAITrun = false;
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
        chess.isAITrun = false;
        return;
    }
    else{
        // If the random selector selected a brick with no possible moves
        // Run the function again untill it's selects a valid brick. 
        pickRandomBrick(possitions);
        chess.brickSelected = false;
        return;
    }
}