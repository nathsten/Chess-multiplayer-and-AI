const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const socketio = require('socket.io');
const http = require('http');
const tf = require('@tensorflow/tfjs');
const engines = require('consolidate');
const { genGamePin, startPossition } = require('./appModules');
const { client } = require('./client');
const port = 5000 || process.env.PORT;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.engine('hbs', engines.handlebars);
app.set('indexPage', './views');
app.set('view engine', 'hbs');

const server = http.createServer(app);
const io = socketio(server);
server.listen(port, e => e ? console.log(e) : console.log(`listening on port:${port}`))

app.use(express.static('../public'));
app.use('/', express.static('../public'));
app.use('/multiplayer', express.static('../public/multiplayer'));
app.use('/local', express.static('../public/local'));
app.use('/AI', express.static('../public/AI'));

client.connect();

io.on('connection', socket => {
    // console.log("on");

    socket.on('player2Joined', data => {
        const player2Name = data;
        io.emit('player2', player2Name)
    });

    socket.on('createNewGame', data => {
        const { gamePin, playerName } = data;
        socket.join(gamePin);
    })

    socket.on('joinGame', data => {
        const { gamePin, playerName } = data;

        socket.join(gamePin);
    })

    socket.on('move', data => {
        const { gamePin, startPossition } = data
        io.to(gamePin).emit('newMove', startPossition);
        client.query(`
            UPDATE games
            SET board = '${startPossition}'
            where game_pin = '${gamePin}';
        `)
    })
})

const gameTypes = [
    { info: 'Play against an AI', text: 'AI' },
    { info: 'Play locally on your computer', text: 'Local' },
    { text: 'Multiplayer', info: 'Play online multiplayer' }
]

app.get('/', (req, res) => {
    res.render('index', {gameTypes})
})

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
            obj.player1 = game[0].player1;
            obj.player2 = game[0].player2;
            if(role === "player2") {
                obj.isPlayer2 = true;
                obj.playerName = playername;
                obj.gamePin = gamePin
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
    .send({gamePin, startPossition, playername, gamePin}));
})

app.post('/joinGame', (req, res) => {
    const { gamePin, playerName } = req.body;
    client.query(`
        SELECT * FROM games
        where game_pin = '${gamePin}';
    `)
    .then(game => {
        if(game){
            // if(game.player2 === ''){
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
                    .send({player1, board, gamePin, playerName});
                })
            // }
        }
        else{
            res.send({msg: "Game not found"})
        }
    }).catch(e => {
        res.send({msg: "Game not found"});
        console.log(e);
    });
})

app.post('/leaveGame', (req, res) => {
    res.clearCookie('playername')
    .clearCookie('role')
    .clearCookie('brick')
    .clearCookie('gamePin')
    .send("game left");
})