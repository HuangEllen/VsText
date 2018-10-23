var canvas = document.querySelector('#myCanvas'),
    context = canvas.getContext('2d'),
    flag = false,
    cw = document.querySelector('#range1'),
    c = document.querySelector('#color1'),
    w = document.querySelector('#span1');

cw.addEventListener("input", function () {
    w.innerHTML = this.value;
})

canvas.addEventListener("mousedown", function (evt) {

    // send(evt.offsetX, evt.offsetY, 'mousedown', c.value, cw.value);//將資訊(參數)傳送給sand這個方法

    flag = true;
    context.beginPath();
    // 線條顏色
    context.strokeStyle = c.value; //$('#color1').val()
    console.log(c.value);
    // 線條寬度
    context.lineWidth = cw.value;

    context.moveTo(evt.offsetX, evt.offsetY)

    // console.log(evt.offsetX + "," + evt.offsetY)

})

canvas.addEventListener("mousemove", function (evt) {
    if (flag) {
        // send(evt.offsetX, evt.offsetY, 'mousemove', c.value, cw.value);//將資訊(參數)傳送給sand這個方法
        context.lineTo(evt.offsetX, evt.offsetY);//使用者滑鼠座標的取得        
        context.stroke();
    }
})
canvas.addEventListener("mouseup", function (evt) {
    //send('mouseup');
    flag = false;
})

var theFile = document.querySelector('#file1')
theFile.addEventListener('change', function () {
    // this.files[0] 就是File物件

    //透過FileReader物件來讀圖
    var reader = new FileReader();
    reader.readAsDataURL(this.files[0])
    reader.addEventListener('load', function (evt) {
        var imageObj = new Image();
        imageObj.src = evt.target.result;
        imageObj.addEventListener('load', function () {
            context.drawImage(imageObj, 0, 0);
        })
    })

})

// // ======== websocket ========

// //todo1 連線到 ws://localhost:8080/ websocket
var socket = new WebSocket("ws://localhost:8080");


function send(x, y, type, c, w) {//使用者滑鼠點的座標(x(座標), y(座標), type(mouse上/下), c(顏色), w(畫筆粗細))
    var jsonObj = { x: x, y: y, type: type, color: c, width: w };
//     //todo2 將jsonOjb資料傳給Socket Server
    socket.send(JSON.stringify(jsonObj));//以JSON方式傳送給伺服器
};

// //todo3 在message事件中，來接收Socket Server回傳的結果
socket.addEventListener("message", function (event) {
    //todo4 將Socket Server回傳的結果轉成Json物件
    var data = JSON.parse(event.data);  
    if (data.type === "mousedown") {
        context.beginPath();
        context.strokeStyle = data.color;
        context.lineWidth = data.width;
        context.moveTo(data.x, data.y);//把畫筆建立道第一個點上

    } else if (data.type === "mousemove") {

        context.lineTo(data.x, data.y);//第二個點
        context.stroke();//連線

    } else {
    }
}, false);

