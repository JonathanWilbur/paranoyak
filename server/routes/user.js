const express = require('express');
const authenticate = require('/paranoyak/server/authenticate.js');
const sessions = require('/paranoyak/server/sessions.js');
const users = require('/paranoyak/server/users.js');
const messages = require('/paranoyak/server/messages.js');
const information = require('/paranoyak/server/information.js');
const info = require('/paranoyak/server/information.js');
const multer = require('multer');
const log = require('/paranoyak/server/log.js');
var userRoute = express.Router();
var mugshotUploader = multer({
  dest: '/paranoyak/mugshots',
  limits: {
    fields: 0,
    parts: 1,
    fileSize: 200000,
  }
});

userRoute.use(function (req, res, next) {
  authenticate.bySessionCookie(req, res, next);
});

userRoute.use(express.static('/paranoyak/user'));
userRoute.use(express.static('/paranoyak/fonts'));
userRoute.use(express.static('/paranoyak/icons'));
userRoute.use('/mugshots', express.static('/paranoyak/mugshots'));

userRoute.get('/chat', function (req, res) {
  res.sendFile('/paranoyak/user/chat.html');
});

userRoute.get('/mugshot', function (req, res) {
  res.sendFile('/paranoyak/user/mugshot.html');
});

userRoute.get('/info', function (req, res) {
  res.sendFile('/paranoyak/user/info.html');
});

userRoute.get('/users', function (req, res) {
  res.sendFile('/paranoyak/user/users.html');
});

userRoute.post('/api/sessions/destroy',
  function (req, res) { sessions.delete(req, res); }
);

userRoute.get('/api/sessions/me',
  function (req, res) { sessions.me(req, res); }
);

userRoute.get('/api/messages/between',
  function(req, res) { messages.retrieveBetweenTimes(req, res, messages); }
);

userRoute.get('/api/messages/recent', function (req, res) {
  var user = getUserFromSession(req.cookies.session);
  messages.retrieveRecent(req, res, user);
});

userRoute.get('/api/messages/update', function (req, res) {
  var user = getUserFromSession(req.cookies.session);
  messages.update(res, res, user);
});

userRoute.get('/api/messages/since', function (req, res) {
  messages.retrieveSince(req, res, messages);
});

userRoute.post('/api/messages/new', function (req, res) {
  var user = getUserFromSession(req.cookies.session);
  messages.create(req, res, user);
});

userRoute.get('/api/users/list',
  function (req, res) { users.show(res); }
);

userRoute.get('/api/users/status',
  function (req, res) { users.status(res); }
);

userRoute.post('/api/users/mugshot',
  mugshotUploader.single('mugshot'),
  function (req, res) { users.setMugshot(req, res); }
);

userRoute.get('/api/info/topics',
  function (req, res) { info.getInfoTopics(res); }
);

userRoute.get('/api/info/about/:topic',
  function (req, res) { info.getInfoAbout(req.params.topic, res); }
);

userRoute.use(function (err, req, res, next) {
  if (err) log.error(err);
});

module.exports = userRoute;


function getUserFromSession(sessionID) {
  for (var i = 0; i < users.list.length; i++) {
    if (users.list[i].session == sessionID) {
      return users.list[i];
      break;
    }
  }
}
