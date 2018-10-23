var WebSocketServer = require('websocket').server;
var http = require('http');
var clients = [];
var server = http.createServer(function (request, response) {

});

server.listen(8080, function () {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,

});


wsServer.on('request', function (request) {
    var connection = request.accept(null, request.origin);
    console.log((new Date()) + ' Connection accepted.');


    var index = clients.push(connection) - 1;//放到陣列當中
    connection.on('message', function (message) {
        console.log(message);//抓取發送出去的資料

        //可以結合mysql方式存取對話紀錄(私訊視窗概念)

        for (var i = 0, max = clients.length; i < max; i++) {
            clients[i].sendUTF(message.utf8Data);//用迴圈把clients資料抓出來
        }

    });
    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});







