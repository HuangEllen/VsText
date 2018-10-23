var express = require('express');
var router = express.Router();
const request = require('request');
const zlib = require('zlib');
const multer = require('multer')


/* GET home page. */
// http://localhost/
router.get('/', function (req, res, next) {
  res.render('index', { title: 'MFEE' });
});

// http://localhost:3000/events
router.get('/events', function (req, res, next) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Connection": "keep-alive",
    "Cache-Control": "no-cache"
  })
  setInterval(function () {
    res.write('data:' + (new Date()).toLocaleTimeString() + '\n\n');
  }, 5000)
  res.write('data:' + (new Date()).toLocaleTimeString() + '\n\n');
});

//http://localhost:3000/youbike
router.get('/youbike', function (req, res, next) {
  res.writeHead(200, {//Server端的回應
    'Content-Type': 'text/event-stream',//重點
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  setInterval(function () {//每隔一分鐘就執行函式去抓取資料
    // 要求http://data.taipei/youbike的資料
    // http://data.taipei/youbike回傳的資料，透過body參數來接收
    request('http://data.taipei/youbike', { 'encoding': null }, function (err, response, body) {//去這裡要資料
      // 透過zlib解壓縮gz  
      zlib.gunzip(body, function (err, dezipped) {
        //console.log(dezipped.toString())
        res.write("data: " + dezipped.toString() + '\n\n');//訊息送到client端 ('\n\n'=換行符號)  
      });
    })
  }, 60000)
  request('http://data.taipei/youbike', { 'encoding': null }, function (err, response, body) {//一開始就要有資料的話他就不能包在setInterval裡面(不然會一分鐘後才會資料載入)
    // 透過zlib解壓縮gz  
    zlib.gunzip(body, function (err, dezipped) {
      //console.log(dezipped.toString())
      res.write("data: " + dezipped.toString() + '\n\n');//會得到繁雜資料量
    });
  })

})

//設定上傳檔案的資料夾
// var upload = multer({ dest: 'public/uploads/' })
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })


//http://localhost:3000/upload
router.post('/upload', upload.single('myFile'), function (req, res, next) {
  res.send(req.file);
})



module.exports = router;
