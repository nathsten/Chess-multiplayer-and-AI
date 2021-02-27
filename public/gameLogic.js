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
        case "br":
            case "bk": break;
            case "bb": break;
            case "bQ": break;
            case "bK": break;
            case "bp": {
                if([...possitions[brickIndex]][4] === "7"){
                    return checkOpenSquare(possitions, type, thisBrickXY, {x: 0, y: -2});
                }
                else{
                    return checkOpenSquare(possitions, type, thisBrickXY, {x: 0, y: -1});
                }
            } break;

            // white
            case "wr": break;
            case "wk": break;
            case "wb": break;
            case "wQ": break;
            case "wK": break;
            case "wp": {
                if([...possitions[brickIndex]][4] === "2"){
                        return checkOpenSquare(possitions, type, thisBrickXY, {x: 0, y: 3});
                    }
                    else{
                        return checkOpenSquare(possitions, type, thisBrickXY, {x: 0, y: 2});
                    }
            } break;
    }
}

/**
 * ALLWAYS add one extra possible route than legal.
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
    const legalMoves = [];

    if(pb.x >= 0){
        for(let x = 0; x < pb.x; x++){
            const xPos = String(thisBrickXY[0] + x);
            const yPos = String(thisBrickXY[1]);
            if(!ps.includes(type + xPos + yPos)){
                xs.push(+xPos);
            }
        }
    }
    else{
        for(let x = pb.x; x < 0; x++){
            const xPos = String(thisBrickXY[0] + x);
            const yPos = String(thisBrickXY[1]);
            if(!ps.includes(type + xPos + yPos)){
                xs.push(+xPos);
            }
        }
    }

    if(pb.y >= 0){
        for(let y = 0; y < pb.y; y++){
            const xPos = String(thisBrickXY[0]);
            const yPos = String(thisBrickXY[1] + y);
            if(!ps.includes(type + xPos + yPos)){
                ys.push(+yPos);
            }
        }
    }
    else{
        for(let y = pb.y; y < 0; y++){
            const xPos = String(thisBrickXY[0]);
            const yPos = String(thisBrickXY[1] + y);
            if(!ps.includes(type + xPos + yPos)){
                ys.push(+yPos);
            }
        }
    }

    var l = xs.length || ys.length;
    for(let i = 0; i < l; i++){
        const x = xs[i] || thisBrickXY[0];
        const y = ys[i] || thisBrickXY[1];
        legalMoves.push({x,y});
    }
    return legalMoves;;
}