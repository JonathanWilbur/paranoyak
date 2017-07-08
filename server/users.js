const fs = require('fs');
const crypto = require('crypto');
const config = require('/paranoyak/server/configuration.js');
const invites = require('/paranoyak/server/invites.js');

module.exports = {

  list: [],

  initialize: function () {
    this.list = require('/paranoyak/server/data/users.json');
  },

  withSession: function (session) {
    console.log("Not yet implemented.");
  },

  withName: function (name) {
    console.log("Not yet implemented.");
  },

  //It is important that you respond with a session cookie!
  create: function (req, res) {
    var session = generateSessionID();
    var salt = (new Date()).getTime().toString();
    const sha256 = crypto.createHash('sha256');
    sha256.update(salt);
    sha256.update(req.body.password);
    var newUser = {
      name: req.body.username,
      passhash: sha256.digest('hex'),
      salt: salt,
      session: session,
      mugshot: "/mugshots/default.jpg",
      email: req.body.email,
      bitcoin: req.body.bitcoin,
      location: req.body.location,
      bio: req.body.bio,
      admin: false,
      online: false,
      lastLogin: 0,
      lastUpdate: 0,
      lastPost: 0
    }
    this.list.push(newUser);
    newUser.session = ""; //This is important! Without this, the session gets stored in .json!
    fs.writeFile('/paranoyak/server/data/users.json', JSON.stringify(this.list));
    newUser.session = session; //This is also important, but not quite as important.
    for (var i = 0; i < invites.outstanding.length; i++) {
      if (invites.outstanding[i].code == req.cookies.invite) {
        invites.outstanding.splice(i, 1);
        break;
      }
    }
    res.clearCookie('invite').cookie('session', session, {
      secure: true,
      httpOnly: true,
      maxAge: 2678400000 //Expire in one month
    }).end();
  },

  delete: function (req, res) {
    console.log("Users cannot be deleted at this time.")
  },

  //TODO: The timeout for a user being considered 'offline' needs to vary with update frequency.
  show: function (res) {
    var userList = [];
    for (var i = 0; i < this.list.length; i++) {
      var user = {
        name: this.list[i].name,
        picture: this.list[i].picture,
        email: this.list[i].email,
        bitcoin: this.list[i].bitcoin,
        mugshot: this.list[i].mugshot,
        location: this.list[i].location,
        bio: this.list[i].bio,
        online: ((new Date()).getTime() > this.list[i].lastUpdate + config.msUntilUserConsideredOffline) ? false : true
      }
      userList.push(user);
    }
    res.json(userList);
  },

  status: function (res) {
    var userList = [];
    for (var i = 0; i < this.list.length; i++) {
      var user = {
        name: this.list[i].name,
        online: ((new Date()).getTime() > this.list[i].lastUpdate + config.msUntilUserConsideredOffline) ? false : true
      }
      userList.push(user);
    }
    res.json(userList);
  },

  promote: function (req, res) {
    console.log("Not yet implemented");
  },

  demote: function (req, res) {
    console.log("Not yet implemented");
  },

  setMugshot: function (req, res) {
    var user = this.withSession(req.cookies.session);
    user.mugshot = "/mugshots/" + req.file.filename;
    fs.writeFile('/paranoyak/server/data/users.json', JSON.stringify(this.list));
    res.end();
  },

  withSession: function (session) {
    for (var i = 0; i < this.list.length; i++) {
      if (this.list[i].session == session) {
        return this.list[i];
        break;
      }
    }
  }

}

function generateSessionID() {
  var buffy = crypto.randomBytes(16);
  return buffy.toString('hex');
}
