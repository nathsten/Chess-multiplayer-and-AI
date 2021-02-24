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
                bottomX.append(marker);
            }
            if(i === 8){
                const marker = new$("div");
                marker.innerHTML = letters[j-1];
                topX.append(marker);  
            }
            if(j === 1){
                const marker = new$("div");
                marker.innerHTML = i;
                topY.append(marker);
            }
            if(j === 8){
                const marker = new$("div");
                marker.innerHTML = i;
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