const users = require('/paranoyak/server/users.js');

module.exports = {

  bySessionCookie: function (cookie) {
    for (var i = 0; i < users.list.length; i++) {
      if (users.list[i].session == cookie) {
        return true;
        break;
      }
    }
    return false; // The function will not make it this far unless the session is not found.
  }

}
