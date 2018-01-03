var cron = require('node-cron');
var marketcap = require('./marketcap')

cron.schedule('*/10 8-23 * * *', function(){
  marketcap.check_coin_price();
});
