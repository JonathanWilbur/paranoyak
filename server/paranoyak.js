const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer  = require('multer');
const api = require('./api.js');
const config = require('./configuration.js');
const authenticate = require('./authenticate.js');
const authorize = require('./authorize.js');
const monitor = require('./monitor.js');
const rootdir = path.resolve(__dirname, '..');
const sendmail = require('./sendmail.js');
var users = require('../data/users.json');
var messages = require('../data/seedMessage.js');
var requestCounter = {};
var outstandingInvites = [];
var app = express();
var mugshotUploader = multer({
  dest: './mugshots',
  limits: {
    fields: 0,
    parts: 1,
    fileSize: 200000,
  }
});

//NOTE: /dev cannot be monitored, because it is a virtual file system.
//NOTE: The NodeJS documentation specifically says that the monitoring functions may not work on VMs.
monitor.directory('/etc', messages);
monitor.directory('/bin', messages);
monitor.directory('/sbin', messages);
monitor.directory('/usr', messages);
monitor.memoryUsage(messages);

app.use(bodyParser.json());
app.use(cookieParser("12346890ABCDEF", {}));

//TODO: In the line below, you have hosted the entire root directory! Tighten up security.
//app.use(express.static(rootdir)); //This is necessary for the other statics to load below.
app.use(express.static(rootdir + '/icons'));
app.use(express.static(rootdir + '/fonts'));

var port = chooseListeningPort();
app.listen(port, function() {
  console.log('ParanoYak listening on port: ' + port);
});

//Assigns listening port to that specified in the command line, but falls back on configuration.
//TODO: Make this fall back on an environment variable, if possible
//TODO: Error-proof this against ports being blocked / privileged.
function chooseListeningPort() {
  if (process.argv.length > 2) {
    for (var i = 2; i < process.argv.length; i++) {
      if (process.argv[i] == "-p" || process.argv[i] == "--port") {
        if (process.argv[i + 1]) {
          return process.argv[i + 1];
        } else {
          console.log("Invalid or missing port argument after '-p' or '--port'.");
          process.exit(1);
        }
      }
    }
  } else if (config.listeningPort) {
    return config.listeningPort;
  } else {
    return 1488;
  }
}

function deleteOldMessages() {
  var firstAcceptableMessage = messages.length;
  var now = (new Date()).getTime();
  for (var i = 0; i < messages.length; i++) {
    if (now - messages[i].timestamp < config.messageAgeLimit) {
      firstAcceptableMessage = i;
      break;
    }
  }
  messages = messages.slice(firstAcceptableMessage);
}

setInterval(deleteOldMessages, 600000);
setInterval(function () {
  requestCounter = {};
}, 3600000);
