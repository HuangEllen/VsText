//匯入相關模組
var WebSocketServer = require('websocket').server;//第三方websocket server模組
var http = require('http');//內建的http模組
var clients = [];//宣告clients當一個儲存訊息的陣列


//建立httpServer
var server = http.createServer(function (request, response) {//createServer建立伺服器(方法)
    //當有使用者連線到8080就會顯示字串+404文字
    console.log((new Date()) + ' Received request for ' + request.url);//得到一個日期時間+字串+request.url(捕捉使用者連線要求是哪個頁面)
    response.writeHead(404);//回傳404
    response.end();//結束回應
});
server.listen(8080, function () {
    console.log((new Date()) + ' Server is listening on port 8080');
});


//建立SocketServer (有了httpServer才能將SocketServer掛在再httpServer上)兩個Server都要啟動
wsServer = new WebSocketServer({
    httpServer: server//在這基礎上去建立SocketServer 
});//ws:localhost:8080

//socketserver request事件
//socketclient 連線到socketserver會觸發request事件
wsServer.on('request', function (request) {//request用法=>監聽使用者連線
    //接受連線(connection代表每一次不同使用者連線進來的人/連線使用者)
    var connection = request.accept(null, request.origin);//accept接收連線(空值,從哪裡連進來的)
    clients.push(connection);//將每個連進來的使用者存進clients陣列中

    console.log((new Date()) + ' Connection accepted.');//回傳日期+字串

    //message事件，接收使用者傳進來的資料(監聽)
    connection.on('message', function (message) {
        //console.log('Received Message: ' + message.utf8Data);//字串(websocket_client.html裡的訊息)+接收(資訊以這格式去運作)

        //接資料傳給使用者
        //connection.sendUTF(message.utf8Data + "From Server");

        //將資料廣播給所有連進來的使用者
        for(var i=0,max=clients.length;i<max;i++){
            clients[i].sendUTF(message.utf8Data);
        }

        // //將資料廣播給所有連進來的使用者
        // for (var i = 0, max = clients.length; i < max; i++) {
        //     clients[i].sendUTF(message.utf8Data);
        // }

    })

    //close事件表示使用者中斷了連線
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');//remoteAddress遠端連線
    });

})