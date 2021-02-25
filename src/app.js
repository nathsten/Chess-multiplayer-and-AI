const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const socketio = require('socket.io');
const http = require('http');
const tf = require('@tensorflow/tfjs');
const { genGamePin, startPossition } = require('./appModules');
const { client } = require('./client');
const port = 5000 || process.env.PORT;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
const server = http.createServer(app);
const io = socketio(server);
server.listen(port, e => e ? console.log(e) : console.log(`listening on port:${port}`))

app.use(express.static('../public'));
app.use('/', express.static('../public'));
app.use('/', express.static('../public/index'));
app.use('/multiplayer', express.static('../public/multiplayer'));
app.use('/local', express.static('../public/local'));
app.use('/AI', express.static('../public/AI'));

client.connect();

io.on('connection', socket => {
    // console.log("on");

    socket.on('player2Joined', data => {
        const player2Name = data;
        console.log(player2Name)
        socket.emit('player2', {player2Name})
    })
})

const gameTypes = [
    { info: 'Play against an AI', text: 'AI' },
    { info: 'Play locally on your computer', text: 'Local' },
    { text: 'Multiplayer', info: 'Play online multiplayer' }
]

app.get('/checkActiveGame', async (req, res) => {
    try{
        const { cookies } = req;
        const { gamePin, playername, role, brick } = cookies;
        const checkGame = await client.query(`
            SELECT * FROM games
            where game_pin = '${gamePin}';
        `);
        const game = await checkGame.rows;
        if(game){
            const { board } = game[0];
            const obj = {board, gamePin};
            if(role === "player2") {
                obj.isPlayer2 = true;
                obj.player1 = game[0].player1;
                obj.player2 = game[0].player2;
            };
            res.send(obj)
        }
        else{
            res.send({});
        }
    }  
    catch(e){
        res.send({});
    } 
})

app.post('/createNewGame', (req, res) => {
    const { playername } = req.body;
    const gamePin = genGamePin();
    client.query(`
        INSERT INTO games(game_pin, player1, player2, board)
        values('${gamePin}', '${playername}', '', '${startPossition}');
    `)
    .then(() => res.cookie('gamePin', gamePin, {path: "/"})
    .cookie('playername', playername, {path: '/'})
    .cookie('role', 'creator', {path: '/'})
    .cookie('brick', 'white', {path: '/'})
    .send({gamePin, startPossition}));
})

app.post('/joinGame', (req, res) => {
    const { gamePin, playerName } = req.body;
    console.log(gamePin);
    client.query(`
        SELECT * FROM games
        where game_pin = '${gamePin}';
    `)
    .then(game => {
        if(game){
            const { player1, board } = game.rows[0];
            client.query(`
                UPDATE games
                SET player2 = '${playerName}'
                where game_pin = '${gamePin}';
            `)
            .then(() => {
                res.cookie('gamePin', gamePin, {path: '/'})
                .cookie('playername', playerName, {path: '/'})
                .cookie('role', 'player2', {path: '/'})
                .cookie('brick', 'black', {path: '/'})
                .send({player1, board, gamePin});
            })
        }
        else{
            res.send({msg: "Game not found"})
        }
    }).catch(e => {
        res.send({msg: "Game not found"});
        console.log(e);
    });
})