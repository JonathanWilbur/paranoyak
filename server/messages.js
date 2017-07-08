const config = require('/paranoyak/server/configuration.js');
const commands = require('/paranoyak/server/commands.js');
const symbols = require('/paranoyak/server/symbols.json');

module.exports = {

  list: require('/paranoyak/server/data/seedMessage.js'),

  invalidMessages: ['', ' ', '\n', '\r', '\r\n', '\t', '\\', '\'', '\"', '\f', '\b'],

  create: function (req, res, user) {

    for (var i = 0; i < this.invalidMessages.length; i++) {
      if (req.body.body == this.invalidMessages[i]) {
        res.sendStatus(400);
        break;
      }
    }

    var newMessage = {
      body: req.body.body.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
      author: user.name,
      mugshot: user.mugshot,
      type: "text", //Text is the default
      timestamp: (new Date()).getTime()
    }

    if (newMessage.body.indexOf('https://youtube.com/watch?') == 0 || newMessage.body.indexOf('https://www.youtube.com/watch?') == 0) {
      newMessage.type = "youtubeVideo";
      var video = newMessage.body.slice(newMessage.body.lastIndexOf('=') + 1);
      newMessage.body = "<iframe class=\"youtubeVideo\" src=\"https://www.youtube.com/embed/" + video + "\" frameborder=\"0\"></iframe>";
    } else if (newMessage.body.indexOf('//twitter.com/') != -1 && newMessage.body.indexOf('/status/') != -1) {
      newMessage.body = "tweet";
    } else {
      newMessage.body = newMessage.body.replace(/(http:\S*|https:\S*)/g, "<a href=\"$1\">$1<\/a>");
    }

    if (req.body.body.charAt(0) == '!') {
      newMessage.type = "command";
      var words = newMessage.body.split(" ");
      switch (words[0]) {
        case "!example":
          commands.example(newMessage);
          break;
        case "!tweet":
          var tweet = newMessage.body.replace("!tweet", "").replace("&lt;", "<").replace("&gt;", ">").trim();
          newMessage.author = ""; //NOTE: You have to manually add you Twitter account here.
          newMessage.mugshot = "/mugshots/twitter.png";
          newMessage.body = user.name + " tweeted: " + tweet;
          newMessage.type = "tweet";
          commands.tweet(tweet);
          break;
        default:
          newMessage.body = "ERROR: Command '" + words[0] + "' not recognized.";
          //TODO: Maybe make this return an error status and return immediately instead of returning an error message?
      }
    }

    for (var i = 0; i < symbols.length; i++) {
      newMessage.body = newMessage.body.replace(symbols[i].symbol, "<img class=\"symbol\" src=\"/symbols/" + symbols[i].image + "\" />");
    }

    this.list.push(newMessage);
    var responseMessages = [];
    var firstAcceptableMessage = 0;
    for (var i = this.list.length - 1; i >= 0; i--) {
      if (this.list[i].timestamp <= user.lastUpdate) {
        firstAcceptableMessage = i + 1;
        break;
      }
    }
    responseMessages = this.list.slice(firstAcceptableMessage, this.list.length);
    user.lastUpdate = newMessage.timestamp; //This is really important! If you just give this a new timestamp, you'll get echoes!
    res.json(responseMessages);

  },

  //TODO: Before submitting a message, check memory usage.
  publish: function (req, res, user) {
    if (req.body.body != '') {
      var newMessage = {
        body: req.body.body,
        author: user.name,
        mugshot: user.mugshot,
        type: "text",
        timestamp: (new Date()).getTime()
      }
      this.list.push(newMessage);
      var responseMessages = [];
      var firstAcceptableMessage = 0;
      for (var i = this.list.length - 1; i >= 0; i--) {
        if (this.list[i].timestamp <= user.lastUpdate) {
          firstAcceptableMessage = i + 1;
          break;
        }
      }
      responseMessages = this.list.slice(firstAcceptableMessage, this.list.length);
      user.lastUpdate = newMessage.timestamp; //This is really important! If you just give this a new timestamp, you'll get echoes!
      res.json(responseMessages);
    }
  },

  retrieveBetweenTimes: function (req, res, messages) {
    var responseMessages = [];
    for (var i = 0; i < this.list.length; i++) {
      if (this.list[i].timestamp >= req.body.from && this.list[i].timestamp <= req.body.to) {
        responseMessages = responseMessages.concat(this.list[i]);
      }
    }
    res.json(responseMessages);
  },

  retrieveSince: function (req, res, messages) {
    var responseMessages = [];
    var firstAcceptableMessage = 0;
    for (var i = this.list.length - 1; i >= 0; i--) {
      if (this.list[i].timestamp <= req.body.since) {
        firstAcceptableMessage = i + 1;
        break;
      }
    }
    responseMessages = this.list.slice(firstAcceptableMessage, this.list.length);
    res.json(responseMessages);
  },

  retrieveRecent: function (req, res, user) {
    var responseMessages = this.list.slice(this.list.length - 1 - req.body.numberOfMessages, this.list.length);
    res.json(responseMessages);
    user.lastUpdate = (new Date()).getTime();
  },

  //TODO: Implement a receipt system so lastUpdate does not update unless client confirms receipt of messages.
  update: function (req, res, user) {
    var responseMessages = [];
    var firstAcceptableMessage = 0;
    for (var i = this.list.length - 1; i >= 0; i--) {
      /*
      Note for posterity's sake: the difference between <= and < are subtle, but EXTREMELY important.
      I was getting message echoes because the newest message has the same timestamp as user.lastUpdate!
      */
      if (this.list[i].timestamp <= user.lastUpdate) {
        firstAcceptableMessage = i + 1;
        break;
      }
    }
    if (this.list.length - firstAcceptableMessage > 50) {
      responseMessages = this.list.slice(this.list.length - 51, this.list.length);
    } else {
      responseMessages = this.list.slice(firstAcceptableMessage, this.list.length);
    }
    user.lastUpdate = (new Date()).getTime();
    res.json(responseMessages);
  },

  deleteOld: function () {
    var firstAcceptableMessage = this.list.length;
    var now = (new Date()).getTime();
    for (var i = 0; i < this.list.length; i++) {
      if (now - this.list[i].timestamp < config.messageAgeLimit) {
        firstAcceptableMessage = i;
        break;
      }
    }
    this.list = this.list.slice(firstAcceptableMessage);
  }

}
