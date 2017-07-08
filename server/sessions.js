const crypto = require('crypto');
const users = require('/paranoyak/server/users.js');

module.exports = {

  //NOTE: Do NOT return any indication that the username or password was correct. This is for security purposes.
  //NOTE: The random delay inserted in here is for making the login immune to timing attacks. Do not remove it.
  //NOTE: Also, do NOT remove the salt from the hash function!
  create: function (req, res) {
    var randomWait = Math.ceil(Math.random() * 10);
    setTimeout(function () {
      var userfound = false;
      if (req.body.username) { //Cannot supply a blank username!
        for (var i = 0; i < users.list.length; i++) {
          if (users.list[i].name == req.body.username) {
            userfound = true;
            const sha256 = crypto.createHash('sha256');
            sha256.update(users.list[i].salt);
            sha256.update(req.body.password);
            var passhash = sha256.digest('hex');
            if (users.list[i].passhash == passhash) {
              users.list[i].session = generateSessionID();
              if (req.body.keepMeLoggedIn == true) {
                res.cookie('session', users.list[i].session, {
                  secure: true,
                  httpOnly: true,
                  maxAge: 2678400000 //Expire in one month
                }).end();
              } else {
                res.cookie('session', users.list[i].session, {
                  secure: true,
                  httpOnly: true
                }).end();
              }
            } else {
              res.status(403).end();
            }
            break;
          }
        }
        if (!userfound) {
          res.status(403).end();
        }
      }
    }, randomWait);
  },

  //REVIEW: Is it a security flaw to return 'noMatchingSession'?
  //TODO: This needs a timeout that clears the localStorage anyway.
  delete: function (req, res) {
    for (var i = 0; i < users.list.length; i++) {
      if (users.list[i].session == req.cookies.session) {
        users.list[i].session = "";
        res.clearCookie('session').end();
        break;
      }
    }
  },

  me: function (req, res) {
    for (var i = 0; i < users.list.length; i++) {
      if (users.list[i].session == req.cookies.session) {
        res.json({
          user: users.list[i].name,
          mugshot: users.list[i].mugshot
        });
        break;
      }
    }
  },

  amILoggedIn: function (req, res) {
    if (req.cookies.session) {
      for (var i = 0; i < users.list.length; i++) {
        if (users.list[i].session == req.cookies.session) {
          res.end();
          return;
        }
      }
      res.sendStatus(401);
    } else {
      res.sendStatus(401);
    }
  }

}

//REVIEW: The random bytes used here are generated synchronously, and may be a source of performance issues later...
function generateSessionID() {
  var buffy = crypto.randomBytes(16);
  return buffy.toString('hex');
}
