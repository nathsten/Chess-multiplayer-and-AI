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
    console.log("on");
    socket.on('test', data => {
        console.log(data);
    });
})

const gameTypes = [
    { info: 'Play against an AI', text: 'AI' },
    { info: 'Play locally on your computer', text: 'Local' },
    { text: 'Multiplayer', info: 'Play online multiplayer' }
]

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