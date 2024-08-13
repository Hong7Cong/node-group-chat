const express = require('express');
const { off } = require('process');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const router = require('express').Router();
var uniqid = require('uniqid'); 
// app.use(express.static('/'));
// app.use(express.static('public'));
app.use(express.static(__dirname));
app.use(express.static('views'));
app.use(express.static('public'));
const util = require('util');
// app.use(express.static(path.join('/', 'public')));
// app.set('views', '/views');
app.engine('html', require('ejs').renderFile);
// app.engine('html', engine.mustache);
app.set('view engine', 'html');
const room_list = [uniqid(),uniqid(),uniqid()]

app.get('/', async (req, res) => {
    console.log("do get /player");
    console.log('GET parameter received are: ',req.query)
    cleaned_data = [{"name":'John'}, {"name":'Nathan'}, {"name":'Hong'}];
    const vars = {
        list_player: cleaned_data,
        room_list: room_list
        };
        
    const render = util.promisify(res.render).bind(res)
    res.render('list.ejs', vars);
});

app.get('/room', function(req, res) {
    const vars = {
        roomid: req.params.pid,
        endpoint: '/room/' + req.params.pid
        };
    res.render('index.ejs', vars);
});

app.post('/room', function(req, res) {
    const vars = {
        roomid: req.params.pid,
        endpoint: '/room/' + req.params.pid
        };
    res.render('index.ejs', vars);
});

app.get('/room/create', (req, res) => {
    console.log("DO POST/PID")
    // console.log('POST parameter received are: ',req.query)
    var data;
    // console.log("do /");
    // const render = util.promisify(res.render).bind(res)
    res.render('create.ejs');
})

app.post('create/room', (req, res) => {
    room_list.append(uniqid());
    console.log(room_list);
})

app.get('/recommender', (req, res) => {
    res.render('recommender.ejs');
    // res.sendFile('/views/leaderboard.html');
});

app.get('/rate', function(req, res) {
    res.render('rate.html');
    // res.sendFile('/views/leaderboard.html');
});

chat = io.of("/room");
chat.on('connection', async (socket) => {
    const roomID = await room.joinRoom();
    socket.join(roomID);

    socket.on('username', function(username) {
        socket.username = username;
        chat.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        room.leaveRoom(roomID);
        chat.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        chat.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });
});

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});