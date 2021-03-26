// @ts-check
/**
 * @param {string} startPossition 
 * @param {number} brickIndex 
 * @param {string} type 
 * @returns {{legalBricks: {x: number, y: number}[], kill: {x: number, y: number}[]}}
 */
const checkBrickMoves = (startPossition, brickIndex, type) => {
    const possitions = startPossition.split("/");
    const thisBrickXY = possitions[brickIndex].split("").filter(e => +e).map(e => +e)

    // brick-color only makes a difference if its a pawn.
    switch(type){
        case "br": {
            const x1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 8, y: 0});
            const x2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: -8, y: 0});
            const y1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: 8});
            const y2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: -8});
            const legalBricks = x1.concat(x2, y1, y2);
            const kill = checkIfBrickCanKill(chess.brickColor, startPossition, legalBricks);
            return {legalBricks, kill};
        }
        case "bk": {
            const legalBricks = checkOpenSquareKnight(possitions, thisBrickXY);
            const kill = checkIfBrickCanKill(chess.brickColor, startPossition, legalBricks)
            return {legalBricks, kill};
        };
        case "bb": {
            const legalBricks = checkOpenSquareDiagonal(possitions, type, thisBrickXY, 8);
            const kill = checkIfBrickCanKill(chess.brickColor, startPossition, legalBricks);
            return {legalBricks, kill};
        };
        case "bQ": {
            const x1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 8, y: 0});
            const x2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: -8, y: 0});
            const y1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: 8});
            const y2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: -8});
            const xy = checkOpenSquareDiagonal(possitions, type, thisBrickXY, 8);
            const legalBricks = x1.concat(x2, y1, y2, xy);
            const kill = checkIfBrickCanKill(chess.brickColor, startPossition, legalBricks);
            return {legalBricks, kill};
        };
        case "bK": {
            const x1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 2, y: 0});
            const x2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: -2, y: 0});
            const y1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: 2});
            const y2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: -2});
            const xy = checkOpenSquareDiagonal(possitions, type, thisBrickXY, 2);
            const legalBricks = x1.concat(x2, y1, y2, xy);
            const kill = checkIfBrickCanKill(chess.brickColor, startPossition, legalBricks);
            return {legalBricks, kill};
        };
        case "bp": {
            if([...possitions[brickIndex]][4] === "7"){
                const legalBricks = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: -3});
                const kill = checkIfPawnCanKill(chess.brickColor, startPossition, thisBrickXY, [{x: -1, y: -1}, {x: 1, y: -1}]);
                return {legalBricks, kill};
            }
            else{
                const legalBricks = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: -2});
                const kill = checkIfPawnCanKill(chess.brickColor, startPossition, thisBrickXY, [{x: -1, y: -1}, {x: 1, y: -1}]);
                return {legalBricks, kill};
            }
        };

        // white
        case "wr": {
            const x1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 8, y: 0});
            const x2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: -8, y: 0});
            const y1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: 8});
            const y2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: -8});
            const legalBricks = x1.concat(x2, y1, y2);
            const kill = checkIfBrickCanKill(chess.brickColor, startPossition, legalBricks);
            return {legalBricks, kill};
        };
        case "wk": {
            const legalBricks = checkOpenSquareKnight(possitions, thisBrickXY);
            const kill = checkIfBrickCanKill(chess.brickColor, startPossition, legalBricks);
            return {legalBricks, kill};
        };
        case "wb": {
            const legalBricks = checkOpenSquareDiagonal(possitions, type, thisBrickXY, 8);
            const kill = checkIfBrickCanKill(chess.brickColor, startPossition, legalBricks);
            return {legalBricks, kill};
        };
        case "wQ": {
            const x1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 8, y: 0});
            const x2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: -8, y: 0});
            const y1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: 8});
            const y2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: -8});
            const xy = checkOpenSquareDiagonal(possitions, type, thisBrickXY, 8);
            const legalBricks = x1.concat(x2, y1, y2, xy);
            const kill = checkIfBrickCanKill(chess.brickColor, startPossition, legalBricks);
            return {legalBricks, kill};
        };
        case "wK": {
            const x1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 2, y: 0});
            const x2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: -2, y: 0});
            const y1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: 2});
            const y2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: -2});
            const xy = checkOpenSquareDiagonal(possitions, type, thisBrickXY, 2);
            const legalBricks = x1.concat(x2, y1, y2, xy);
            const kill = checkIfBrickCanKill(chess.brickColor, startPossition, legalBricks);
            return {legalBricks, kill};
        };
        case "wp": {
            if([...possitions[brickIndex]][4] === "2"){
                    const legalBricks = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: 3});
                    const kill = checkIfPawnCanKill(chess.brickColor, startPossition, thisBrickXY, [{x: -1, y: 1}, {x: 1, y: 1}]);
                    return {legalBricks, kill};
                }
                else{
                    const legalBricks = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: 2});
                    const kill = checkIfPawnCanKill(chess.brickColor, startPossition, thisBrickXY, [{x: -1, y: 1}, {x: 1, y: 1}]);
                    return {legalBricks, kill};
                }
        };
    }
}

/**
 * ALLWAYS add one extra possible route than legal if possible route is positive.
 * @param {string[]} possitions 
 * @param {string} type
 * @param {number[]} thisBrickXY 
 * @param {{x: number, y: number}} pb 
 * @returns {{x: number, y: number}[]}
 */
const checkOpenSquareHorizontalVertial = (possitions, type, thisBrickXY, pb) => {
    // List of legal moves x- direction
    const xs = [];
    // List of legal moves y- direction
    const ys = [];
    const ps = possitions.map(e => e.split(",").join(""));
    // List of taken squares.
    const tsq = ps.map(e => [...e]).map(([a,b,c,d]) => [a,c,d].join(""));
    // list of all the legal moves {x: int, y: int}
    const legalMoves = [];
    var mc = chess.brickColor.split("")[0].toLowerCase();
    var oc = mc === "w" ? "b" : "w";
    if(chess.isAITurn) { oc = "w"; mc = "b" };
    // if(chess.algoCheck) { oc = "b"; mc = "w" };
    var x,y;

    var xsActive = true;
    var ysActive = true;

    if(pb.x >= 0){
        for(x = 1; x < pb.x; x++){
            const xPos = String(thisBrickXY[0] + x);
            const yPos = String(thisBrickXY[1]);
            if(tsq.includes(mc + xPos + yPos) && +xPos !== thisBrickXY[0]) xsActive = false;
            if((!tsq.includes("w" + (xPos) + (yPos)) || !tsq.includes("b" + xPos + yPos)) && xsActive){
                xs.push(+xPos);
            }
            if(tsq.includes(oc + xPos + yPos) && +xPos !== thisBrickXY[0]) xsActive = false;
        }
    }
    else{
        for(x = -1; x > pb.x; x--){
            const xPos = String(thisBrickXY[0] + x);
            const yPos = String(thisBrickXY[1]);
            if(tsq.includes(mc + xPos + yPos) && +xPos !== thisBrickXY[0]) xsActive = false;
            if((!tsq.includes("w" + xPos + yPos) || !tsq.includes("b" + xPos + yPos)) && xsActive){
                xs.push(+xPos);
            }
            if(tsq.includes(oc + xPos + yPos) && +xPos !== thisBrickXY[0]) xsActive = false;
        }
    }

    if(pb.y >= 0){
        for(y = 1; y < pb.y; y++){
            const xPos = String(thisBrickXY[0]);
            const yPos = String(thisBrickXY[1] + y);
            if(tsq.includes(mc + xPos + yPos) && +yPos !== thisBrickXY[1]) ysActive = false;
            if((!tsq.includes("w" + xPos + yPos) || !tsq.includes("b" + xPos + yPos)) && ysActive){
                ys.push(+yPos);
            }
            if(tsq.includes(oc + xPos + yPos) && +yPos !== thisBrickXY[1]) ysActive = false;
        }
    }
    else{
        for(y = -1; y > pb.y; y--){
            const xPos = String(thisBrickXY[0]);
            const yPos = String(thisBrickXY[1] + y);
            if(tsq.includes(mc + xPos + yPos) && +yPos !== thisBrickXY[1]) ysActive = false;
            if((!tsq.includes("w" + xPos + yPos) || !tsq.includes("b" + xPos + yPos)) && ysActive){
                ys.push(+yPos);
            }
            if(tsq.includes(oc + xPos + yPos) && +yPos !== thisBrickXY[1]) ysActive = false;
        }
    }

    const l = xs.length || ys.length;
    for(let i = 0; i < l; i++){
        const x = xs[i] || thisBrickXY[0];
        const y = ys[i] || thisBrickXY[1];
        legalMoves.push({x,y});
    }
    return legalMoves.filter(e => e.x >= 1 && e.x <= 8 && e.y >= 1 && e.y <= 8);
}

/**
* @param {string[]} possitions 
* @param {string} type
* @param {number[]} thisBrickXY 
* @param {number} pb 
* @returns {{x: number, y: number}[]}
*/
const checkOpenSquareDiagonal = (possitions, type, thisBrickXY, pb) => {
    const ps = possitions.map(e => e.split(",").join(""));
    const tsq = ps.map(e => [...e]).map(([a,b,c,d]) => [a,c,d].join(""));
    var mc = chess.brickColor.split("")[0].toLowerCase();
    // opponent color
    var oc = mc === "w" ? "b" : "w";
    if(chess.isAITurn) { oc = "w"; mc = "b" };
    // if(chess.algoCheck) { oc = "b"; mc = "w" };
    const legalMoves = [];
    var xy1 = true;
    var xy2 = true;
    var xy3 = true;
    var xy4 = true;

    for(var i = 1; i < pb; i++){
        const CBX1 = String(thisBrickXY[0]+i);
        const CBY1 = String(thisBrickXY[1]+i);
        if(tsq.includes(mc + CBX1 + CBY1)) xy1 = false;
        if((!tsq.includes("b" + CBX1 + CBY1) 
        || !tsq.includes("w" + CBX1 + CBY1)) && xy1){
            legalMoves.push({x: +CBX1, y: +CBY1});
        }
        if(tsq.includes(oc + CBX1 + CBY1)) xy1 = false;

        const CBX2 = String(thisBrickXY[0]+i);
        const CBY2 = String(thisBrickXY[1]-i);
        if(tsq.includes(mc + CBX2 + CBY2)) xy2 = false;
        if((!tsq.includes("b" + CBX2 + CBY2) 
        || !tsq.includes("w" + CBX2 + CBY2)) && xy2){
            legalMoves.push({x: +CBX2, y: +CBY2});
        }
        if(tsq.includes(oc + CBX2 + CBY2)) xy2 = false;

        const CBX3 = String(thisBrickXY[0]-i);
        const CBY3 = String(thisBrickXY[1]+i);
        if(tsq.includes(mc + CBX3 + CBY3)) xy3 = false;
        if((!tsq.includes("b" + CBX3 + CBY3) 
        || !tsq.includes("w" + CBX3 + CBY3)) && xy3){
            legalMoves.push({x: +CBX3, y: +CBY3});
        }
        if(tsq.includes(oc + CBX3 + CBY3)) xy3 = false;

        const CBX4 = String(thisBrickXY[0]-i);
        const CBY4 = String(thisBrickXY[1]-i);
        if(tsq.includes(mc + CBX4 + CBY4)) xy4 = false;
        if((!tsq.includes("b" + CBX4 + CBY4) 
        || !tsq.includes("w" + CBX4 + CBY4)) && xy4){
            legalMoves.push({x: +CBX4, y: +CBY4});
        }
        if(tsq.includes(oc + CBX4 + CBY4)) xy4 = false;
    }

    return legalMoves.filter(e => e.x >= 1 && e.x <= 8 && e.y >= 1 && e.y <= 8);
}

/**
* @param {string[]} possitions 
* @param {number[]} thisBrickXY 
* @returns {{x: number, y: number}[]}
*/
const checkOpenSquareKnight = (possitions, thisBrickXY) => {
    // All the possible moves a Knight can make
    const possibleMoves = [
        {x: 2, y: 1}, {x: 1, y: 2}, 
        {x: -2, y: 1}, {x: -1, y: 2},
        {x: -2, y: -1}, {x: 2, y: -1},
        {x: -1, y: -2}, {x: 1, y: -2}
    ];

    const ps = possitions.map(e => e.split(",").join(""));
    const tsq = ps.map(e => [...e]).map(([a,b,c,d]) => [a,c,d].join(""));
    var mc = chess.brickColor.split("")[0].toLowerCase();
    var oc = mc === "w" ? "b" : "w";
    if(chess.isAITurn) { oc = "w"; mc = "b" };
    // if(chess.algoCheck) { oc = "b"; mc = "w" };
    const legalMoves = [];

    possibleMoves.forEach(move => {
        const { x, y } = move;
        const thisX = String(thisBrickXY[0] + x);
        const thisY = String(thisBrickXY[1] + y);
        if(!tsq.includes(mc + thisX + thisY)) legalMoves.push({x: +thisX, y: +thisY});
    });

    return legalMoves.filter(e => e.x >= 1 && e.x <= 8 && e.y >= 1 && e.y <= 8);
}

/**
 * @param {string} birckColor 
 * @param {string} startPossition
 * @param {{x: number, y: number}[]} openMoves 
 * @returns {{x: number, y: number}[]} 
 */
const checkIfBrickCanKill = (birckColor, startPossition, openMoves) => {
    const sp = startPossition.split("/").map(e => e.split(",").join(""));
    const tsq = sp.map(e => [...e]).map(([a,b,c,d]) => [a,c,d].join(""));
    var c = birckColor === "white" ? "b" : "w";
    if(chess.isAITurn) c = "w";
    // if(chess.algoCheck) c = "b";
    // if(chess.algoCheck) c = "b";
    const bricksCanKill = [];
    openMoves.forEach(move => {
        const { x, y } = move;
        if(tsq.includes(c + x + y)){
            bricksCanKill.push({x,y});
        }
    });
    return bricksCanKill;
}

/**
 * @param {string} brickColor 
 * @param {string} startPossition
 * @param {number[]} thisBrickXY 
 * @param {{x: number, y: number}[]} possibleMoves
 * @returns {{x: number, y: number}[]} 
 */
const checkIfPawnCanKill = (brickColor, startPossition, thisBrickXY, possibleMoves) => {
    const sp = startPossition.split("/").map(e => e.split(",").join(""));
    const tsq = sp.map(e => [...e]).map(([a,b,c,d]) => [a,c,d].join(""));
    var oc = brickColor === "white" ? "b" : "w";
    if(chess.isAITurn) oc = "w"; 
    const bricksCanKill = [];

    possibleMoves.forEach(move => {
        const { x, y } = move;
        const PKX = String(thisBrickXY[0] + x);
        const PKY = String(thisBrickXY[1] + y);
        if(tsq.includes(oc + PKX + PKY)) bricksCanKill.push({x: +PKX, y: +PKY});
    });

    return bricksCanKill;
}

/**
 * @param {string} possitions 
 * @param {string[]} allBricks a list of all the bricks with turn color
 * @returns {{inCheck: boolean, allKills: {x: number, y:number}[][], allMoves: {x: number, y:number}[][]}} if some bricks can kill the king
 */
const checkKing = (possitions, allBricks) => {
    const color = allBricks[0][0];
    var cc = color === "w" ? "b" : "w";
    if(chess.isAITurn) cc = "w"; 
    if(chess.algoCheck) cc = "b";
    // List of all bricks that can be killed.
    const allKills = [];
    // List of all moves that can be made
    const allMoves = [];
    var inCheck = false;
    allBricks.forEach(brick => {
        const brickXY = brick.split("").filter(e => +e).map(e => +e);
        const type = brick.match(/[a-zA-Z]/gm).join("");
        const brickIndex = startPossition.split("/").indexOf(type + "," + brickXY.join(""));
        // Every brick's index that can be killed
        const killBricks = checkBrickMoves(possitions, brickIndex, type);
        allKills.push({kill: killBricks.kill.filter(e => e.x >= 1 && e.x <= 8 && e.y >= 1 && e.y <= 8), type});
        allMoves.push({legalBricks: killBricks.legalBricks.filter(e => e.x >= 1 && e.x <= 8 && e.y >= 1 && e.y <= 8), type})
    })
    const cK = chess.algoCheck ? "b" : undefined;
    const pXY = possitions.split("/").filter(e => e[0] === (cK || cc) && e[1] === "K").map(e => e.split(",")).map(([a,b]) => b.split("").map(e => +e))
    if(!pXY[0]){
        inCheck = true;
        return {inCheck, allKills, allMoves};
    }
    allKills.forEach(killList => {
        killList.kill.forEach((kill) => {
            const { x, y } = kill;
            // If kings index includes in the killLists
            if(pXY[0][0] === x && pXY[0][1] === y) inCheck = true;
        })
    })
    return {inCheck, allKills, allMoves};
}

/** Unused for now.
 * @param {{x: number, y:number}[]} kingMoves 
 * @param {{x: number, y:number}[][]} allMoves 
 * @returns {boolean}
 */
const checkIfKingCanMoveWhileInCheck = (kingMoves, allMoves) => {
    var checkMate = false;
    var kills = 0;
    kingMoves.forEach(move => {
        allMoves.forEach(moveList => moveList.forEach(kill => kill.x === move.x && kill.y === move.y ? kills++ : null))
    })

    if(kills === kingMoves.length) checkMate = true;
    return checkMate
}

/** Quick solution for check mate. 
 * @param {string[]} killList 
 * @param {string} color 
 * @returns {boolean}
 */
const checkMate = (killList, color) => {
    const king = (color === "w" ? "b" : "w") + "K";
    return killList.includes(king);
}

/**
 * @param {number} brickIndex 
 * @param {string[]} myKillList 
 */
const killBrick = (brickIndex, myKillList) => {
    var newPossitions = startPossition.split("/");
    myKillList.push(newPossitions[brickIndex].match(/[a-z A-Z]+/gm).join(""));
    newPossitions.splice(brickIndex, 1);
    startPossition = newPossitions.join("/");
}