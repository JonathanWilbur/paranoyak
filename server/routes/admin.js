const express = require('express');
const invites = require('/paranoyak/server/invites.js');
const authenticate = require('/paranoyak/server/authenticate.js');
const authorize = require('/paranoyak/server/authorize.js');
const sendmail = require('/paranoyak/server/sendmail.js');
const users = require('/paranoyak/server/users.js');
const log = require('/paranoyak/server/log.js');
var adminRoute = express.Router();

adminRoute.use(
  function (req, res, next) { authorize.ifSessionIsAdmin(req, res, next); }
);

adminRoute.use(express.static('/paranoyak/admin'));

adminRoute.get('/invite', function (req, res) {
  res.sendFile('/paranoyak/admin/invite.html');
});

adminRoute.post('/api/invites/create', function (req, res) {
  var user = getUserFromSession(req.cookies.session);
  sendmail.toAdministrator("Invite Created", "The user '" + user.name + "' created a new invite.");
  invites.create(res, user);
});

adminRoute.use(function (err, req, res, next) {
  if (err) log.error(err);
});

module.exports = adminRoute;

function getUserFromSession(sessionID) {
  for (var i = 0; i < users.list.length; i++) {
    if (users.list[i].session == sessionID) {
      return users.list[i];
      break;
    }
  }
}
