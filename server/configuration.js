//Most of these are currently unused--just jotted down here while I am thinking about them.
//All times are in milliseconds.
//All directory names must end with backslashes.
module.exports = {
  listeningPort: 443,
  maxMemoryUsageBytes: 400000000,
  msUntilUserConsideredOffline: 30000,
  maxMessages: 5,
  maxMessageLength: 3000,
  messageAgeLimit: 86400000,
  maxUsernameLength: 32,
  maxPasswordLength: 32,
  maxSessions: 2,
  inviteLifespan: 600000,
  logDirectory: "/paranoyak/server/logs/",
  logArchivesDirectory: "/paranoyak/server/logs/archives/",
  authFailureLog: "auth.log",
  errorLog: "error.log",
  performanceLog: "perf.log",
  intrusionLog: "intrusion.log",
  hostEmail: "root@localhost",
  adminEmail: "root@localhost",
  authFailuresBetweenLogging: 50,
  authFailuresUntilEmailAlert: 400,
  maxLogBytes: 100000
}
