//TODO: Create an enum for the message types.
module.exports = [
  {
    body: "This is a test message. If you have received this, your session is valid. It also means that the server was probably rebooted recently.",
    author: "SYSTEM",
    mugshot: "/mugshots/system.jpg",
    type: "text",
    timestamp: (new Date()).getTime()
  }
];
