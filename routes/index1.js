var express = require('express');
var router = express.Router();//Router路由
const request = require('request');//宣告request名稱=require匯入request物件
const zlib = require('zlib');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

//localhost:3000/youbike
router.get('/youbike', function (req, res, next) {//function裡的參數是當初設定好的
  //request(第三方套件)的方法是(url,encoding的設定,接收要求回來的結果(錯誤,輸出/回應,接收位置)))
  request('http://data.taipei/youbike', { 'encoding': null }, function (err, response, body) {
    //要求http://data.taipei/youbike的資料
    //http://data.taipei/youbike回傳的資料，透過body參數來接收
    //console.log(body);//確認資料的回傳是透過body來接收的


    //透過zlib解壓縮gz
    zlib.gunzip(body, function (err, dezipped) {//gunzip是套件裡的解壓縮方法(傳入body,解壓縮完之後(錯誤,dezipped))
      console.log(dezipped.toString());//dezipped解果以字串模式顯示(JSON格式)
    });
  })
  res.send('YouBike!!')
})

module.exports = router;
