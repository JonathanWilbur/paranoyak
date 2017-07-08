const prohibitedUsernames = require('/paranoyak/server/data/prohibitedusernames.js');
const prohibitedPasswordSubstrings = require('/paranoyak/server/data/prohibitedPasswordSubstrings.js');
const config = require('/paranoyak/server/configuration.js');
const users = require('/paranoyak/server/users.js');
const invites = require('/paranoyak/server/invites.js');

module.exports = {

  bySessionCookie: function (cookie) {
    for (var i = 0; i < users.list.length; i++) {
      if (users.list[i].session == cookie) {
        if (users.list[i].admin) {
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  },

  byInvite: function (invite) {
    for (var i = 0; i < invites.outstanding.length; i++) {
      if (invites.outstanding[i].code == invite) {
        if ((new Date()).getTime() - invites.outstanding[i].timestamp < config.inviteLifespan) {
          return true;
        } else {
          invites.outstanding.splice(i, 1);
          return false;
        }
      }
    }
    return false;
  },

  toHaveUsername: function (name) {
    for (var i = 0; i < prohibitedUsernames.length; i++) {
      if (prohibitedUsernames[i] == name) {
        return false;
      }
    }
    for (var i = 0; i < users.list.length; i++) {
      if (users.list[i].name.toLowerCase() == name.toLowerCase()) {
        return false;
      }
    }
    return true;
  },

  //TODO: Update this with even more stringent requirements.
  toHavePassword: function (password) {
    for (var i = 0; i < prohibitedPasswordSubstrings.length; i++) {
      if (password.indexOf(prohibitedPasswordSubstrings[i]) != -1) {
        return false;
      }
    }
    return true;
  }

}
