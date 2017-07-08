const log = require('/paranoyak/server/log.js');
const Twit = require('twit');
const twitterClient = new Twit({
  consumer_key: '',
  consumer_secret: '',
  access_token: '',
  access_token_secret: ''
});

module.exports = {

  example: function (message) {
    message.body = "Example command executed";
  },

  tweet: function (text) {
    twitterClient.post('statuses/update', { status: text }, function (err, data, response) {
      if (err) log.error(err);
    });
  }

}
