const config = require('/paranoyak/server/configuration.js');
const users = require('/paranoyak/server/users.js');
const zlib = require('zlib');
const fs = require('fs');

module.exports = {

  createLog: function (subject) {
    console.log("Not yet implemented.");
  },

  authFailure: function (req, message) {
    var user = "";
    if (req.cookies.session) user = getUserFromSession(req.cookies.session);
    fs.appendFile(
      config.logDirectory + config.authFailureLog,
      (new Date()).toUTCString() + " : " + message + " for " + req.method + " " + req.path + " from " + user + "@" + req.ip + "\n",
      (err) => { if (err) throw err; }
    );
    fs.stat(config.logDirectory + config.authFailureLog, function (err, stats) {
      if (err) throw err;
      if (stats.size > config.maxLogBytes) {
        var gzip = zlib.createGzip();
        var inputFile = fs.createReadStream(config.logDirectory + config.authFailureLog);
        var outputFile = fs.createWriteStream(config.logArchivesDirectory + (new Date).getTime() + config.authFailureLog + ".gz");
        inputFile.pipe(gzip).pipe(outputFile);
        fs.writeFile(config.logDirectory + config.authFailureLog, "", (err) => { if (err) throw err; });
      }
    });
  },

  error: function (err) {
    fs.appendFile(
      config.logDirectory + config.errorLog,
      err.stack,
      function (err) { if (err) throw err; }
    );
  },

  intrusion: function (message) {
    fs.appendFile(
      config.logDirectory + config.intrusionLog,
      (new Date()).toUTCString() + " : " + message + "\n",
      (err) => { if (err) throw err; }
    );
    fs.stat(config.logDirectory + config.intrusionLog, function (err, stats) {
      if (err) throw err;
      if (stats.size > config.maxLogBytes) {
        var gzip = zlib.createGzip();
        var inputFile = fs.createReadStream(config.logDirectory + config.intrusionLog);
        var outputFile = fs.createWriteStream(config.logArchivesDirectory + (new Date).getTime() + config.intrusionLog + ".gz");
        inputFile.pipe(gzip).pipe(outputFile);
        fs.writeFile(config.logDirectory + config.intrusionLog, "", (err) => { if (err) throw err; });
      }
    });
  },

  performanceIssue: function (message) {
    fs.appendFile(
      config.logDirectory + config.performanceLog,
      (new Date()).toUTCString() + " : " + message + "\n",
      (err) => { if (err) throw err; }
    );
    fs.stat(config.logDirectory + config.performanceLog, function (err, stats) {
      if (err) throw err;
      if (stats.size > config.maxLogBytes) {
        var gzip = zlib.createGzip();
        var inputFile = fs.createReadStream(config.logDirectory + config.performanceLog);
        var outputFile = fs.createWriteStream(config.logArchivesDirectory + (new Date).getTime() + config.performanceLog + ".gz");
        inputFile.pipe(gzip).pipe(outputFile);
        fs.writeFile(config.logDirectory + config.performanceLog, "", (err) => { if (err) throw err; } );
      }
    });
  }

}

function getUserFromSession(sessionID) {
  for (var i = 0; i < users.list.length; i++) {
    if (users.list[i].session == sessionID) {
      return users.list[i];
      break;
    }
  }
}
