var http = require('http');
var express = require('express');
var app = express();

// view engine setup
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');

// static file setting
app.use(express.static('public'));

//route setup
var index = require('./routes/index');
app.use('/', index);

//port setup
var port = process.env.PORT || 3000;


var server = http.createServer(app);
server.listen(port);


// Azure
var azure = require('azure');
var hubName = 'nodejs-azure-tutorial';
var connectionString = 'Endpoint=sb://nodejs-azure-tutorial.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=FC6RFV77kGZpDK2jYFy0ndljvqKfDwR/Uj+dZn7h9aE=';
var notificationHubService = azure.createNotificationHubService(hubName,connectionString);

var io = require('socket.io').listen(server);
io.sockets.on('connection',function(socket){
    socket.emit('toclient',{msg:'Welcome !'});
    notificationHubService.gcm.send(null, {data:{id:socket.id, message:'Welcome'}},function(error){
        if(!error){
            console.log('send');
        }
    });

    socket.on('fromclient',function(data){
        socket.broadcast.emit('toclient',data); // 자신을 제외하고 다른 클라이언트에게 보냄
        socket.emit('toclient',data); // 해당 클라이언트에게만 보냄. 다른 클라이언트에 보낼려면?
        console.log('Message from client :'+data.msg);
    });
    if(!data.msg==""){
        notificationHubService.gcm.send(null, {data:{id:socket.id, message:data.msg}}, function(error){
            if(!error){
                //notification sent
                    console.log('send');
            }
        });
    }
});
