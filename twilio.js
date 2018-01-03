require('dotenv').config();

const accountSid = 'AC893a13361350baa30261d10ba5f32edd';
const authToken = process.env.TWILIO_TOKEN;
const client = require('twilio')(accountSid, authToken);


module.exports = {
  sendMess: function (mess, toNum) {
    client.messages.create({
      body: mess,
      to: toNum,
      from: '+14136506108',
    })
    .then((message) => process.stdout.write(message.sid));
  }
}
