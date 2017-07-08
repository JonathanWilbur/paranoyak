const fs = require('fs');
const log = require('/paranoyak/server/log.js');
const sendmail = require('/paranoyak/server/sendmail.js');
const config = require('/paranoyak/server/configuration.js');
const messages = require('/paranoyak/server/messages.js');

module.exports = {

  directory: function (directory) {
    console.log("Monitoring directory: " + directory);
    fs.watch(directory, { recursive: true }, function (event, filename) {
      messages.list.length = 0; //The array MUST be cleared this way. If you use messages = [], it just creates a brand new array only within this scope.
      var alert = {
                    body: "All messages have been deleted on the server because signs of intrusion were detected. The administrator has been alerted.",
                    author: "SYSTEM",
                    type: "alert",
                    timestamp: (new Date()).getTime()
                  }
      messages.list.push(alert);
      log.intrusion(filename + " somewhere within " + directory + " has changed! Event: " + event);
      sendmail.toAdministrator("ParanoYak Intrusion Alert", "The messages history has been reset because signs of intrusion have been detected. Details:\n\t" + event + " " + filename);
    });
  },

  file: function (file) {
    console.log("Not yet implemented.");
  },

  memoryUsage: function() {
    console.log("Monitoring memory usage. MaxMemoryUsageBytes: " + config.maxMemoryUsageBytes);
    setInterval(function () {
      var mem = process.memoryUsage(); //I did not daisy-chain this function, because I think it might be a costly function.
      if (mem.rss > config.maxMemoryUsageBytes || mem.heapTotal - mem.heapUsage < (mem.heapTotal * 0.9)) {
        messages.list.length = 0; //The array MUST be cleared this way. If you use messages = [], it just creates a brand new array only within this scope.
        var alert = {
                      body: "All messages have been deleted on the server because memory usage got too high. The administrator has been alerted.",
                      author: "SYSTEM",
                      type: "alert",
                      timestamp: (new Date()).getTime(),
		      mugshot: "/paranoyak/mugshots/system.jpg"
                    }
        messages.list.push(alert);
        log.performanceIssue("Memory usage reached dangerous levels. RSS: " + mem.rss + " bytes, HeapTotal: " + mem.heapTotal + " bytes, HeapUsage: " + mem.heapUsed + " bytes");
        sendmail.toAdministrator("ParanoYak Memory Alert", "Memory usage reached dangerous levels. RSS: " + mem.rss + " bytes, HeapTotal: " + mem.heapTotal + " bytes, HeapUsage: " + mem.heapUsed + " bytes");
      }
    }, 60000);
  },

  environmentVariables: function () {
    console.log("Not yet implemented.");
  },

  processorArchitecture: function () {
    console.log("Not yet implemented.");
  },

  runningProcesses: function () {
    console.log("Not yet implemented");
  }

}
