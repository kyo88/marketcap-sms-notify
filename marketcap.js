var rp = require('request-promise');
var twilio = require('./twilio');
require('dotenv').config();

var coins = ['ethereum', 'ripple', 'litecoin'];
// var coins = ['ethereum'];

module.exports = {

  check_coin_price: function () {
    var now = new Date();
    var yesterday = new Date(now.getTime() - 24*60*60*1000);

    var nowTime = getRoundTime(now);
    var yesTime = getRoundTime(yesterday);

    for (var i = 0; i < coins.length ; i++) {
      var coin = coins[i];
      console.log(i);
      var options = {
          uri: 'https://graphs.coinmarketcap.com/currencies/' + coins[i] + '/' + yesTime +  '/' + nowTime + '/',
          headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'
          }
      };

      rp(options)
          .then(function (repos) {
              // console.log(repos);
              var info = JSON.parse(repos);
              var prices = [];
              //console.log(info.price_usd);
              for(var item of info.price_usd) {
                prices.push(item[1]);
                // for(var i = 0; i < item.length; i++){

                // }
               // break;
             }
             var startPri = info.price_usd[0][1];
             var current = info.price_usd[info.price_usd.length - 1][1];
             console.log(startPri);
             sendMessIfNeeded(startPri, current, getMax(prices), getMin(prices));
          })
          .catch(function (err) {
              // API call failed...
          });

    }
  }
}


var getRoundTime = function (dt) {
  return Math.round((dt.getTime()/1000)) * 1000;
}

var getMax = function (arr) {
  return arr.reduce(function(a, b) {
      return Math.max(a, b);
  });
}

var getMin = function (arr) {
  return arr.reduce(function(a, b) {
      return Math.min(a, b);
  });
}

var sendMessIfNeeded  = function (startPri, current, max, min ) {
  var change = round((current / startPri) * 100 - 100, 2);
  var mess = 'Change = [' + change + '%], Current=[' + current + '] , Max = [' + max + '] , Min = [' + min  + ']';
  console.log(mess);
  twilio.sendMess(mess, process.env.KYO_NUM);
  // if ( current == max ) {
  //   twilio.sendMess(process.env.KYO_NUM, mess);
  // } else if ( current == min ) {
  //   twilio.sendMess(process.env.KYO_NUM, mess);
  // } else {
  //   twilio.sendMess(mess, process.env.KYO_NUM);
  // }
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
