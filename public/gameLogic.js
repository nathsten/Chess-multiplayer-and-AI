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
            const x1 = checkOpenSquare(possitions, type, thisBrickXY, {x: 8, y: 0});
            const x2 = checkOpenSquare(possitions, type, thisBrickXY, {x: -8, y: 0});
            const y1 = checkOpenSquare(possitions, type, thisBrickXY, {x: 0, y: 8});
            const y2 = checkOpenSquare(possitions, type, thisBrickXY, {x: 0, y: -8});
            return x1.concat(x2, y1, y2);;
        }
        case "bk": {
            return [];
        };
        case "bb": {
            return [];
        };
        case "bQ": {
            return [];
        };
        case "bK": {
            return [];
        };
        case "bp": {
            if([...possitions[brickIndex]][4] === "7"){
                return checkOpenSquare(possitions, type, thisBrickXY, {x: 0, y: -2});
            }
            else{
                return checkOpenSquare(possitions, type, thisBrickXY, {x: 0, y: -1});
            }
        };

        // white
        case "wr": {
            const x1 = checkOpenSquare(possitions, type, thisBrickXY, {x: 8, y: 0});
            const x2 = checkOpenSquare(possitions, type, thisBrickXY, {x: -8, y: 0});
            const y1 = checkOpenSquare(possitions, type, thisBrickXY, {x: 0, y: 8});
            const y2 = checkOpenSquare(possitions, type, thisBrickXY, {x: 0, y: -8});
            return x1.concat(x2, y1, y2);
        };
        case "wk": {
            return [];
        };
        case "wb": {
            const xy1 = checkOpenSquare(possitions, type, thisBrickXY, {x: 8, y: 8});
            const xy2 = checkOpenSquare(possitions, type, thisBrickXY, {x: -8, y: -8});
            const xy3 = checkOpenSquare(possitions, type, thisBrickXY, {x: 8, y: -8});
            const xy4 = checkOpenSquare(possitions, type, thisBrickXY, {x: -8, y: 8});
            return xy1.concat(xy2, xy3, xy4);
        };
        case "wQ": {
            return [];
        };
        case "wK": {
            return [];
        };
        case "wp": {
            if([...possitions[brickIndex]][4] === "2"){
                    return checkOpenSquare(possitions, type, thisBrickXY, {x: 0, y: 3});
                }
                else{
                    return checkOpenSquare(possitions, type, thisBrickXY, {x: 0, y: 2});
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
const checkOpenSquare = (possitions, type, thisBrickXY, pb) => {
    let xs = [];
    let ys = [];
    const ps = possitions.map(e => e.split(",").join(""));
    const tsq = ps.map(e => e.match(/\d+/gm).join(""));
    const legalMoves = [];
    var x,y;

    if(pb.x >= 0){
        for(x = 0; x < pb.x; x++){
            const xPos = String(thisBrickXY[0] + x);
            const yPos = String(thisBrickXY[1]);
            if(!tsq.includes(xPos + yPos)){
                xs.push(+xPos);
            }
            // if(tsq.includes(xPos + yPos)) break;
        }
    }
    else{
        for(x = pb.x; x < 0; x++){
            const xPos = String(thisBrickXY[0] + x);
            const yPos = String(thisBrickXY[1]);
            if(!tsq.includes(xPos + yPos)){
                xs.push(+xPos);
            }
            // if(tsq.includes(xPos + yPos)) break;
        }
    }

    if(pb.y >= 0){
        for(y = 0; y < pb.y; y++){
            const xPos = String(thisBrickXY[0]);
            const yPos = String(thisBrickXY[1] + y);
            if(!tsq.includes(xPos + yPos)){
                ys.push(+yPos);
            }
            // if(tsq.includes(xPos + yPos)) break;
        }
    }
    else{
        for(y = pb.y; y < 0; y++){
            const xPos = String(thisBrickXY[0]);
            const yPos = String(thisBrickXY[1] + y);
            if(!tsq.includes(xPos + yPos)){
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