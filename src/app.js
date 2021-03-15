const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const socketio = require('socket.io');
const http = require('http');
const tf = require('@tensorflow/tfjs');
const engines = require('consolidate');
const { readFileSync } = require('fs');
const { genGamePin, startPossition } = require('./appModules');
const { client } = require('./client');
const cons = require('consolidate');
const port = 5000 || process.env.PORT;

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.engine('hbs', engines.handlebars);
app.set('indexPage', './views');
app.set('view engine', 'hbs');

const server = http.createServer(app);
const io = socketio(server);
server.listen(port, e => e ? console.log(e) : console.log(`listening on port:${port}`))

app.use('/', express.static('../public'));
app.use('/multiplayer', express.static('../public/multiplayer'));
app.use('/local', express.static('../public/local'));
app.use('/AI', express.static('../public/AI'));

client.connect();

io.on('connection', socket => {

    socket.on('player2Joined', data => {
        const {player2Name, gamePin} = data;
        io.to(gamePin).emit('player2', player2Name)
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
        const { gamePin, startPossition, color, myKillList } = data
        const player = color === "white" ? "p1kills" : "p2kills";
        io.to(gamePin).emit('newMove', {startPossition, color, killList: myKillList});
        client.query(`
            UPDATE games
            SET board = '${startPossition}'
            where game_pin = '${gamePin}';
        `)
        // Kill list still have som few bugs on how its transfered. 
        .then(() => {
            client.query(`
                UPDATE games
                SET ${player} = '${myKillList}'
                where game_pin = '${gamePin}';
            `);
        })
    })

    socket.on('chatMsg', data => {
        const {chatMsg, sender, gamePin } = data;
        io.to(gamePin).emit('incommingChatMsg', {msg: chatMsg, sender})
    })

    socket.on('leaveGame', data => {
        const { playerName, gamePin, role } = data;
        io.to(gamePin).emit('playerLeft', {playerName});
        if(role){
            client.query(`
                UPDATE games
                SET player2 = ''
                where game_pin = '${gamePin}';
            `);
        }
        else{
            client.query(`
                DELETE FROM games
                where game_pin = '${gamePin}';
            `);
        }

    })
})

const gameTypes = JSON.parse(readFileSync('gameTypes.json')).gameTypes;

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
        if(game[0]){
            const { board } = game[0];
            const obj = {board, gamePin};
            obj.player1 = game[0].player1;
            obj.player2 = game[0].player2;
            obj.p1Kills = game[0].p1kills;
            obj.p2Kills = game[0].p2kills;
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
        console.log(e);
    } 
})

app.post('/createNewGame', (req, res) => {
    const { playername } = req.body;
    const gamePin = genGamePin();
    client.query(`
        INSERT INTO games(game_pin, player1, player2, board, p1kills, p2kills)
        values('${gamePin}', '${playername}', '', '${startPossition}', '', '');
    `)
    .then(() => res.cookie('gamePin', gamePin, {path: "/"})
    .cookie('playername', playername, {path: '/'})
    .cookie('role', 'creator', {path: '/'})
    .cookie('brick', 'white', {path: '/'})
    .send({gamePin, startPossition, playername, gamePin}))
    .catch(e => {
        res.send({msg: `Failed to create new game: ${e}`});
        console.log(e);
    });
})

app.post('/joinGame', (req, res) => {
    const { gamePin, playerName } = req.body;
    client.query(`
        SELECT * FROM games
        where game_pin = '${gamePin}';
    `)
    .then(game => {
        if(game){
            if(!game.player2){
                const { player1, board, p1kills, p2kills } = game.rows[0];
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
                    .send({player1, board, gamePin, playerName, p1kills, p2kills});
                })
            }
            else{
                res.send({msg: "There are already two players in this game"});
            }
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
    try{
        res.clearCookie('playername')
        .clearCookie('role')
        .clearCookie('brick')
        .clearCookie('gamePin')
        .send({status: "game left successfully"});
    }
    catch(e){
        console.log(e);
        res.send({status: "game left unsuccessfully"});
    }
})

// console.log(startPossition.match(/\D+/gm).map((e, i) => i >= 1 ? e.slice(1, e.length-1) : e.slice(0, e.length-1)))