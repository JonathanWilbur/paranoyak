const crypto = require('crypto');

module.exports = {

  outstanding: [],

  create: function (res, user) {
    var buffy = crypto.randomBytes(16);
    var invite = {
      code: buffy.toString('hex'),
      timestamp: (new Date()).getTime()
    };
    this.outstanding.push(invite);
    res.json({
      invite: invite.code
    });
    //console.log('Invite created by user ' + user.name);
  },

  destroy: function () {
    console.log('Invite destroyed');
  }

}
