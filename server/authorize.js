const authorized = require('/paranoyak/server/authorized.js');
const log = require('/paranoyak/server/log.js');
const users = require('/paranoyak/server/users.js');
const invites = require('/paranoyak/server/invites.js');
//const sendmail = require('./sendmail.js');
//var authorizationFailures = {};

module.exports = {

  ifSessionIsAdmin: function (req, res, next) {
    if (req.cookies.session) {
      if (authorized.bySessionCookie(req.cookies.session)) {
        next();
      } else {
        log.authFailure(req, "Session invalid");
        res.sendStatus(403);
      }
    } else {
      log.authFailure(req, "No session");
      res.sendStatus(403);
    }
  },

  //TODO: You may need to respond with .clearCookie('session') if session is invalid.
  ifInviteIsValid: function (err, req, res, next) {
    if (req.params.invite) {
      if (authorized.byInvite(req.params.invite)) {
        next();
      } else {
        log.authFailure(req, "No invite in URL");
        res.sendStatus(403);
      }
    } else if (req.cookies.invite) {
      if (authorized.byInvite(req.cookies.invite)) {
        next();
      } else {
        log.authFailure(req, "Invalid invite cookie");
        res.sendStatus(403);
      }
    } else {
      log.authFailure(req, "No invite cookie");
      res.sendStatus(403);
    }
  },

  ifUsernameAvailable: function (req, res, next) {
    if (req.body.username) {
      if (authorized.toHaveUsername(req.body.username)) {
        next();
      } else {
        res.status(400).json({
          username: req.body.username,
          reason: "taken"
        });
      }
    } else {
      res.sendStatus(400);
    }
  },

  ifPasswordValid: function (req, res, next) {
    if (req.body.password) {
      if (authorized.toHavePassword(req.body.password)) {
        next();
      } else {
        res.status(400).json({
          password: req.body.password,
          reason: "weak"
        });
      }
    } else {
      res.sendStatus(400);
    }
  },

  ifLimitNotExceeded: function (req, res, next, requestCounter, limitPerHour) {
    if (!requestCounter[req.ip]) {
      requestCounter[req.ip] = {};
      requestCounter[req.ip][req.path] = 1;
      next();
    } else {
      if (!requestCounter[req.ip][req.path]) {
        requestCounter[req.ip][req.path] = 1;
        next();
      } else {
        if (requestCounter[req.ip][req.path] == limitPerHour) {
          log.authFailure(req, "Limit exceeded");
          res.sendStatus(429);
        } else {
          requestCounter[req.ip][req.path]++;
          next();
        }
      }
    }
  },

}
