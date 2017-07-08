const express = require('express');
const api = require('/paranoyak/server/users.js');
const authorize = require('/paranoyak/server/authorize.js');
const authenticate = require('/paranoyak/server/authenticate.js');
const log = require('/paranoyak/server/log.js');
var users = require('/paranoyak/server/users.js');
var inviteeRoute = express.Router();

//inviteeRoute.use(express.static('/paranoyak/invitee'));

inviteeRoute.get('/signup/:invite',
  //function (req, res, next) { authorize.ifLimitNotExceeded(req, res, next, requestCounter, 5) },
  function (err, req, res, next) { authorize.ifInviteIsValid(err, req, res, next); },
  function (req, res) { res.cookie('invite', req.params.invite).sendFile('/paranoyak/invitee/signup.html'); }
);

inviteeRoute.get('/signup.css',
  //function (req, res, next) { authorize.ifLimitNotExceeded(req, res, next, requestCounter, 5) },
  function (err, req, res, next) { authorize.ifInviteIsValid(err, req, res, next); },
  function (req, res) { res.sendFile('/paranoyak/invitee/signup.css'); }
);

inviteeRoute.get('/signup.js',
  //function (req, res, next) { authorize.ifLimitNotExceeded(req, res, next, requestCounter, 5) },
  function (err, req, res, next) { authorize.ifInviteIsValid(err, req, res, next); },
  function (req, res) { res.sendFile('/paranoyak/invitee/signup.js'); }
);

inviteeRoute.post('/api/users/create',
  function (err, req, res, next) { authorize.ifInviteIsValid(err, req, res, next); },
  function (req, res, next) { authorize.ifUsernameAvailable(req, res, next); },
  function (req, res, next) { authorize.ifPasswordValid(req, res, next); },
  function (req, res) { users.create(req, res); }
);

inviteeRoute.use(function (err, req, res, next) {
  if (err) log.error(err);
});

module.exports = inviteeRoute;
