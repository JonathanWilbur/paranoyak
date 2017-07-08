const express = require('express');
const authorize = require('/paranoyak/server/authorize.js');
const sessions = require('/paranoyak/server/sessions.js');
const log = require('/paranoyak/server/log.js');
var publicRoute = express.Router();
var requestCounter = {};

publicRoute.use(express.static('/paranoyak/public'));

publicRoute.get('/',
  function (req, res) { res.sendFile('/paranoyak/public/login.html'); }
);

publicRoute.post('/api/sessions/create',
  function (req, res, next) { authorize.ifLimitNotExceeded(req, res, next, requestCounter, 30); },
  function (req, res) { sessions.create(req, res); }
);

publicRoute.get('/api/sessions/amILoggedIn',
  function (req, res, next) { authorize.ifLimitNotExceeded(req, res, next, requestCounter, 30); },
  function (req, res) { sessions.amILoggedIn(req, res); }
);

publicRoute.use(function (err, req, res, next) {
  if (err) log.error(err);
});

module.exports = publicRoute;
