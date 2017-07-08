const config = require('/paranoyak/server/configuration.js');
const Email = require('email').Email;
const HOST_EMAIL = "paranoyak@127.0.0.1";

module.exports = {

  toAdministrator: function (subject, message) {
    var msg = new Email({
      from: config.hostEmail,
      to: config.adminEmail,
      subject: subject,
      body: message
    });
    msg.send(function (err) {
      if (err) console.log("Failed to send email with error: " + err.message);
    });
  },

  toUsers: function (subject, message, users) {
    for (var i = 0; i < users.length; i++) {
      if (users[i].email) {
        var msg = new Email({
          from: config.hostEmail,
          to: users[i].email,
          subject: subject,
          body: message
        });
        msg.send(function (err) {
          if (err) console.log("Failed to send email with error: " + err.message);
        });
      }
    }
  }

}
