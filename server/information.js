module.exports = {

  getInfoTopics: function (res) {
    var topics = [];
    for (var i = 0; i < information.length; i++) {
      topics.push({title: information[i].title, topic: information[i].topic});
    }
    res.json(topics);
  },

  getInfoAbout: function (reqtopic, res) {
    for (var i = 0; i < information.length; i++) {
      if (reqtopic == information[i].topic) {
        res.json(information[i]);
        break;
      }
    }
  }

}


var information = [
  {
    topic: "general",
    title: "General",
    body: "ParanoYak is a chat service that stores messages only in memory so that all messages are deleted when the server reboots. ParanoYak also monitors the operating system for changing that might indicate intrusion, in which case, it automatically deletes all messages. Who would have guessed it would be so paranoid?"
  },
  {
    topic: "bugs",
    title: "Bugs",
    body: "If you find any bugs, please report them to Administrator via email."
  },
  {
    topic: "interface",
    title: "Interface",
    body: "On the left, the sidebar shows the buttons for logging off, information, a list of users. If you click on a user in the sidebar, a pop up will appear with their information. If you click on the mail envelope icon next to their name, your email client will pop up with their email address filled in. Note that some users have chosen not to offer their email addresses, so if you click on their mail icon, your email client will pop up with no address in the 'To' field. You can tell that a user has offered an email address to ParanoYak if they have a mail envelope icon to the right of their name in the sidebar. The text field at the bottom of the page, where you supply text for a new message, is called the 'terminal.' It is a pretty fitting term, because, as well as entering new messages, you can also enter commands."
  },
  {
    topic: "newusers",
    title: "New Users",
    body: "New members are welcome to ParanoYak, but must be invited first."
  },
  {
    topic: "symbols",
    title: "Symbols",
    body: "ParanoYak supports he use of symbols in chat. Symbols are words prepended with the dollar sign, which will translate to an image (usually a dank maymay) in the chat history. For example, '$shrek' will translate to an image of Shrek."
  },
  {
    topic: "commands",
    title: "Commands",
    body: "ParanoYak supports the use of commands in chat. Commands are words prepended with an exclamation point, which, if typed by themselves into the terminal, will perform some task, such as issuing a new tweet on Twitter, or returning a random Huffington Post article. If the text typed into terminal begins with an exclamation point, the characters that follow up until the next space will be interpreted as the command name. All other words that follow that command will be interpreted as arguments. If you wish to supply multiple words as a single argument, you can group the words together in quotes. For example, \"!poll 'Ice Cream Flavor?' vanilla ketchup\" will post a poll in chat with the options 'vanilla' and 'ketchup' for users to choose."
  },
  {
    topic: "messages",
    title: "Messages",
    body: "Submit new messages by typing text into the text box at the bottom of the screen (called the 'terminal') then either click on the Send button, or use the tab key to tab over to the Send button and press Enter to send the message. The message will be sent to the ParanoYak server, and when it returns, it will appear in the chat history."
  },
  {
    topic: "donations",
    title: "Donations",
    body: "Please donate to keep this server alive. It costs money."
  },
  {
    topic: "security",
    title: "Security",
    body: "All messages on ParanoYak are stored only in memory, and will be deleted when ParanoYak reboots, or when the message history has grown too large. ParanoYak also monitors critical system directories and files on its host program, and will shutdown if it detects signs of intrusion, thus deleting the chat history. User accounts, however, are persistent. If the server were intruded, the intruders would be able to retrieve usernames, email addresses, public keys for bitcoin wallets, and the SHA-256 hash of the user's password as well as the salt used to generate it. Other data used by user accounts are only low-value information used by the program, such as the timestamp since the user last retrieved new messages."
  },
  {
    topic: "source",
    title: "Source",
    body: "For personal reasons, Administrator cannot post the source code for ParanoYak publicly until late 2017. Until then, if you would like to see the source code to confirm that ParanoYak is not just transmitting everything back to the JIDF homebase on the moon, just send him an email, and he will try to do what he can reasonably do to prove that the server is genuinely fashy."
  },
  {
    topic: "sessions",
    title: "Sessions",
    body: "By default, ParanoYak stores your session in sessionStorage, meaning that you will be logged out when you close your browser. However, if you check the 'Keep me logged in' button on the login page, your session will be stored in localStorage, which means that it will persist between closures of your browser, and even between shutdowns of your computer; you will remain logged in until you press the 'log out' button on the chat page. Note that, if the server is rebooted, all sessions will be deleted and you will have to log in again. Right now, you can only have one device logged into an account at a time, but Administrator expects to provide Multiple Session support in Version 2.0.0."
  },
  {
    topic: "messagetypes",
    title: "Message Types",
    body: "(Not yet implemented) ParanoYak supports--or will support--strongly-typed messages. This means that messages will no longer be categorized vaguely as 'text' or 'image', but instead, 'wiki' or 'tweet' or 'youtubevideo', and the message, as it appears in the chat history will display relevant information or controls. For example, though the sender of the message only copied and pasted a link from Wikipedia into chat, the message type would be recorded as 'wiki', and it would display in chat as the title of the wiki followed by a preview of the article."
  },
  {
    topic: "versions",
    title: "Versions",
    body: "ParanoYak is versioned according to semantic versioning. That means that, if the last number (the patch number) changes, bugs were fixed or the performance or security improved, but no new features were added. If the second number (the minor version) changed, new features were added, but not in such a way as would make it incompatible with previous versions. If the first number (the major version) changes, there was a change that breaks compatibility with previous versions."
  }
]
