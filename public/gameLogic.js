// @ts-check
/**
 * @param {string} startPossition 
 * @param {number} brickIndex 
 * @param {string} type 
 * @returns {{x: number, y: number}[]}
 */
const checkBrickMoves = (startPossition, brickIndex, type) => {
    const possitions = startPossition.split("/");
    const thisBrickXY = possitions[brickIndex].split("").filter(e => +e).map(e => +e)

    switch(type){
        case "br": {
            const x1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 8, y: 0});
            const x2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: -8, y: 0});
            const y1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: 8});
            const y2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: -8});
            return x1.concat(x2, y1, y2);;
        }
        case "bk": {
            return [];
        };
        case "bb": {
            return checkOpenSquareDiagonal(possitions, type, thisBrickXY, 8);
        };
        case "bQ": {
            const x1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 8, y: 0});
            const x2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: -8, y: 0});
            const y1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: 8});
            const y2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: -8});
            const xy = checkOpenSquareDiagonal(possitions, type, thisBrickXY, 8);
            return x1.concat(x2, y1, y2, xy);
        };
        case "bK": {
            const x1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 2, y: 0});
            const x2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: -1, y: 0});
            const y1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: 2});
            const y2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: -1});
            const xy = checkOpenSquareDiagonal(possitions, type, thisBrickXY, 2);
            return x1.concat(x2, y1, y2, xy);;
        };
        case "bp": {
            if([...possitions[brickIndex]][4] === "7"){
                return checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: -2});
            }
            else{
                return checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: -1});
            }
        };

        // white
        case "wr": {
            const x1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 8, y: 0});
            const x2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: -8, y: 0});
            const y1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: 8});
            const y2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: -8});
            return x1.concat(x2, y1, y2);
        };
        case "wk": {
            return [];
        };
        case "wb": {
            return checkOpenSquareDiagonal(possitions, type, thisBrickXY, 8);
        };
        case "wQ": {
            const x1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 8, y: 0});
            const x2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: -8, y: 0});
            const y1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: 8});
            const y2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: -8});
            const xy = checkOpenSquareDiagonal(possitions, type, thisBrickXY, 8);
            return x1.concat(x2, y1, y2, xy);
        };
        case "wK": {
            const x1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 2, y: 0});
            const x2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: -1, y: 0});
            const y1 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: 2});
            const y2 = checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: -1});
            const xy = checkOpenSquareDiagonal(possitions, type, thisBrickXY, 2);
            return x1.concat(x2, y1, y2, xy);
        };
        case "wp": {
            if([...possitions[brickIndex]][4] === "2"){
                    return checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: 3});
                }
                else{
                    return checkOpenSquareHorizontalVertial(possitions, type, thisBrickXY, {x: 0, y: 2});
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
    const xs = [];
    const ys = [];
    const ps = possitions.map(e => e.split(",").join(""));
    const tsq = ps.map(e => [...e]).map(([a,b,c,d]) => [a,c,d].join(""));
    const color = type[0];
    const legalMoves = [];
    var x,y;

    if(pb.x >= 0){
        for(x = 0; x < pb.x; x++){
            const xPos = String(thisBrickXY[0] + x);
            const yPos = String(thisBrickXY[1]);
            if(!tsq.includes(color + xPos + yPos)){
                xs.push(+xPos);
            }
            // if(tsq.includes(xPos + yPos)) break;
        }
    }
    else{
        for(x = pb.x; x < 0; x++){
            const xPos = String(thisBrickXY[0] + x);
            const yPos = String(thisBrickXY[1]);
            if(!tsq.includes(color + xPos + yPos)){
                xs.push(+xPos);
            }
            // if(tsq.includes(xPos + yPos)) break;
        }
    }

    if(pb.y >= 0){
        for(y = 0; y < pb.y; y++){
            const xPos = String(thisBrickXY[0]);
            const yPos = String(thisBrickXY[1] + y);
            if(!tsq.includes(color + xPos + yPos)){
                ys.push(+yPos);
            }
            // if(tsq.includes(xPos + yPos)) break;
        }
    }
    else{
        for(y = pb.y; y < 0; y++){
            const xPos = String(thisBrickXY[0]);
            const yPos = String(thisBrickXY[1] + y);
            if(!tsq.includes(color + xPos + yPos)){
                ys.push(+yPos);
            }
            // if(tsq.includes(xPos + yPos)) break;
        }
    }

    const l = xs.length || ys.length;
    for(let i = 0; i < l; i++){
        const x = xs[i] || thisBrickXY[0];
        const y = ys[i] || thisBrickXY[1];
        legalMoves.push({x,y});
    }
    return legalMoves;
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
    const color = type[0];
    const legalMoves = [];

    for(var i = 0; i < pb; i++){
        const CBX1 = String(thisBrickXY[0]+i);
        const CBY1 = String(thisBrickXY[1]+i);
        if(!tsq.includes(color + CBX1 + CBY1)){
            legalMoves.push({x: +CBX1, y: +CBY1});
        }

        const CBX2 = String(thisBrickXY[0]+i);
        const CBY2 = String(thisBrickXY[1]-i);
        if(!tsq.includes(color + CBX2 + CBY2)){
            legalMoves.push({x: +CBX2, y: +CBY2});
        }

        const CBX3 = String(thisBrickXY[0]-i);
        const CBY3 = String(thisBrickXY[1]+i);
        if(!tsq.includes(color + CBX3 + CBY3)){
            legalMoves.push({x: +CBX3, y: +CBY3});
        }

        const CBX4 = String(thisBrickXY[0]-i);
        const CBY4 = String(thisBrickXY[1]-i);
        if(!tsq.includes(color + CBX4 + CBY4)){
            legalMoves.push({x: +CBX4, y: +CBY4});
        }
    }

    return legalMoves
}

/**
 * @param {number} brickIndex 
 * @param {string[]} myKillList 
 */
const killBrick = (brickIndex, myKillList) => {
    var newPossitions = startPossition.split("/");
    newPossitions.splice(brickIndex, 1);
    myKillList.push(newPossitions[brickIndex].match(/[a-z]+/gm).join(""));
    startPossition = newPossitions.join("/");
}