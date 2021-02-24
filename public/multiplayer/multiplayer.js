const socket = io();

// const startPossition = `br,18/bk,28/bb,38/bQ,48/bK,58/bb,68/bk,78/br,88/bp,17/bp,27/bp,37/bp,47/bp,57/bp,67/bp,77/bp,87/wr,11/wk,21/wb,31/wQ,41/wK,51/wb,61/wk,71/wr,81/wp,12/wp,22/wp,32/wp,42/wp,52/wp,62/wp,72/wp,82`;
let startPossition = "";

/**
 * @param {MouseEvent} e 
 */
const moveBrick = e => {
    const brickId = String(e.target.id);
    const id = brickId.split("").map(e => +e);
}

/**
 * @param {HTMLDivElement} brickBoard 
 * @param {string} possitions 
 */
const placeBricks = (brickBoard, possitions) => {
    brickBoard.innerHTML = "";
    possitions.split("/").map(e => e.split(","))
    .forEach(([b, p]) => {
        const type = posByType(b);
        const [x, y] = p.split("").map(e => +e);
        const boardPos = {x,y};
        const div = new$("div");
        const brick = new Brick(type, boardPos, div);
        brick.div.className = "brick";
        brick.div.id = `${x}${y}`;
        brick.div.onclick = moveBrick;
        brick.render();
        brickBoard.append(brick.div);
    })
}

const chess = new Vue({
    el: "#chessRoot",
    data: {
        gameStarted: false
    },
    methods: {
        printBoard: () => {
            if(chess.gameStarted) {
                printBoard(chessBoard, { topX, topY, bottomX, bottomY });
            }
        },
        placeBricks: async () => {
            if(chess.gameStarted) {
                // const getStartPossistion = await fetch('/startPossition');
                // const startPossition = await getStartPossistion.json();
                placeBricks(brickBoard, startPossition);
            }
        },
        createNewGame: () => {
            const playername = String(playernameCreate.value);
            if(playername !== ""){
                chess.gameStarted = true;
                fetch('/createNewGame', {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({playername}),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(res => res.json())
                .then(data => {
                    const [ chessBoard, brickBoard, gamePinDiv ] = $("chessBoard,brickBoard,gamePin");
                    const [ topX, bottomX, topY, bottomY ] = $("topX,bottomX,topY,bottomY");
                    gamePinDiv.innerHTML = `Gamepin: ${data.gamePin}`;
                    startPossition = data.startPossition
                    printBoard(chessBoard, { topX, topY, bottomX, bottomY });
                    placeBricks(brickBoard, startPossition);
                })
            }
            else{
                alert("Please add a playername");
            }
        },
        joinGame: () => {

        }
    }
})

const [ playernameCreate, gamePinInput, playernameJoin ] = $("playernameCreate,gamePin,playernameJoin");

chess.printBoard();
chess.placeBricks();