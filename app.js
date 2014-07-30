
var http = require('http');
var express = require('express'),
    ioServer = require('socket.io');

var routes = require('./routes'),
    settings = require('./settings');

var app = express();

app.engine('.html', require('ejs').__express)

// all environments
app.set('port', settings.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

routes(app);

var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});


var io = ioServer.listen(server);

var users = [];

io.sockets.on('connection', function (socket) {
    var username;

    socket.on('login', function (data) {
        username = data;
        if(users.indexOf(username) == -1) {
            users.push(username);

            socket.broadcast.emit('login', { loginUser: username });
            socket.emit('login', { status: 'success', users: users });
            console.log("user " + data + " connected");
        }
        else {
            socket.emit('login', { status: 'error' });
        }
    });

    socket.on('message', function(data) {
        if(username) {
            var now = new Date(),
                message = {
                    time: now.format('yyyy-MM-dd HH:mm:ss'),
                    sendTime: now.getTime(),
                    sender: username,
                    content: data
                };

            io.sockets.emit('message', message);
            console.log("user "+ message.sender +" said \"" + message.content + "\"");
        }
    });

    socket.on('disconnect', function() {
        if (users.indexOf(username) > -1) {
            users.splice(users.indexOf(username), 1);

            io.sockets.emit('logout', username);
            console.log("user " + username + " connected");
        }
        username = '';
    });
});