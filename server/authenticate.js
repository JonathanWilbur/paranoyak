const authenticated = require('/paranoyak/server/authenticated.js');
const config = require('/paranoyak/server/configuration.js');
const log = require('/paranoyak/server/log.js');
const sendmail = require('/paranoyak/server/sendmail.js');
const users = require('/paranoyak/server/users.js');
var authenticationFailures = {};

module.exports = {

  bySessionCookie: function (req, res, next) {
    if (req.cookies.session) {
      if (authenticated.bySessionCookie(req.cookies.session)) {
        next();
      } else {
        if (!authenticationFailures[req.ip]) {
          authenticationFailures[req.ip] = 1;
        } else {
          authenticationFailures[req.ip]++;
          if (authenticationFailures[req.ip] % config.authFailuresBetweenLogging == 1) log.authFailure(req, "Session invalid");
          if (authenticationFailures[req.ip] == config.authFailuresUntilEmailAlert) {
            sendmail.toAdministrator("ParanoYak Security Alert",
              "This is an automated message from ParanoYak to alert you that there have been a suspicious number " +
              "of failed authentication attempts from the IP addres: " + req.ip + ". Please check " +
              config.authFailureLog + " in " + config.logDirectory + " for more details. If you believe these messages " +
              "occur too frequently, please adjust the authFailuresBeforeAlert parameter in ./server/configuration.js."
            );
          }
        }
        res.clearCookie('session').sendStatus(401);
      }
    } else {
      if (!authenticationFailures[req.ip]) {
        authenticationFailures[req.ip] = 1;
      } else {
        authenticationFailures[req.ip]++;
        if (authenticationFailures[req.ip] % config.authFailuresBetweenLogging == 1) log.authFailure(req, "No session");
        if (authenticationFailures[req.ip] == config.authFailuresUntilEmailAlert) {
          sendmail.toAdministrator("ParanoYak Security Alert",
            "This is an automated message from ParanoYak to alert you that there have been a suspicious number " +
            "of failed authentication attempts from the IP addres: " + req.ip + " with no session ID. Please check " +
            config.authFailureLog + " in " + config.logDirectory + " for more details. If you believe these messages " +
            "occur too frequently, please adjust the authFailuresBeforeAlert parameter in ./server/configuration.js."
          );
        }
      }
      res.sendStatus(401);
    }
  }

}

setInterval(function () {
  authenticationFailures = {};
}, 3600000);
