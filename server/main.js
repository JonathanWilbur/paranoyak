const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');
const https = require('https');
const helmet = require('helmet');
const config = require('/paranoyak/server/configuration.js');
const authenticate = require('/paranoyak/server/authenticate.js');
const authorize = require('/paranoyak/server/authorize.js');
const monitor = require('/paranoyak/server/monitor.js');
const messages = require('/paranoyak/server/messages.js');
const users = require('/paranoyak/server/users.js');
const log = require('/paranoyak/server/log.js');

users.initialize();

//NOTE: /dev cannot be monitored, because it is a virtual file system.
//NOTE: The NodeJS documentation specifically says that the monitoring functions may not work on VMs.
//monitor.directory('/etc'); //This has been commented about because changing user accounts sends me an infinite torrent of emails.
monitor.directory('/bin');
monitor.directory('/sbin');
//monitor.directory('/usr'); //This might be infeasible, because this directory might change too much.
monitor.memoryUsage();

var app = express();
app.use(helmet());
// app.set('x-powered-by', false);
app.use(bodyParser.json());
app.use(cookieParser("12346890ABCDEF", {}));
// app.use(function (req, res, next) { res.set('Strict-Transport-Security'); next(); });
app.use('/', require('/paranoyak/server/routes/public.js'));
app.use('/', require('/paranoyak/server/routes/invitee.js'));
app.use('/', require('/paranoyak/server/routes/user.js'));
app.use('/', require('/paranoyak/server/routes/admin.js'));

var options = {
  key: fs.readFileSync('/paranoyak/server/ssl/privkey.pem'),
  cert: fs.readFileSync('/paranoyak/server/ssl/fullchain.pem')
};

var port = chooseListeningPort();
https.createServer(options, app).listen(port);
console.log('ParanoYak listening on port: ' + port);

//TODO: Make this fall back on an environment variable, if possible
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
    return 443;
  }
}

setInterval(function () {
  messages.deleteOld(); //This must be enclosed in a function or 'this' will refer to the interval, not the messages object.
}, 3600000);
setInterval(function () {
  requestCounter = {};
}, 3600000);
