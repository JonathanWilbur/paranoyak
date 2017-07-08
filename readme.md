# ParanoYak

ParanoYak is a chat server / web application that stores all messages only
in memory. When the server shuts down, all messages are deleted. Further,
ParanoYak monitors the surrounding operating system for changes that might
indicate signs of intrusion, such as changes in critical system files, or
the addition of new users, or the mounting of a device, and deletes all
messages if such a change is found.

## Installation and Setup

Get ready, because setting up ParanoYak is not easy.

### File placement

All of the files of ParanoYak need to be installed in a root-level directory
named `paranoyak`. When installed, the path to `main.js` should be 
`/paranoyak/server/main.js`. If this is the case, then you have installed the
files to the correct location.

### TLS Configuration

You need to acquire a TLS certiciate and key for your server. I recommend using
[CertBot](https://certbot.eff.org/) to acquire a 
[Let's Encrypt](https://letsencrypt.org/) TLS Certificate. 

Some browsers (reasonably) require a full TLS certificate chain, whereas others
only require just the standalone certificate. To create the certificate chain,
simply run the following command, substituting the names of the certificate
files: `cat rootca.pem intermediateca.pem yourcert.pem > fullchain.pem`.

I do not have the time to teach you all about TLS, so if that doesn't work for
you, StackOverflow is your friend.

Once you have a certificate, a key, and a full certificate chain, you will need
the file names to be these respectively:

* `cert.pem`
* `privkey.pem`
* `fullchain.pem`

And the will need to be placed in the `/paranoyak/server/ssl` directory.
Alternatively, you might be able to get away with making this files symbolic
links to files elsewhere on the system, but I haven't tried that, so I can't
say for sure if it would work.

### User Setup

You will need to create the first user (who must also be an administrator) in
the `server/data/users.json` file, and set `admin` to `true`. The included JSON
file has all the fields a user object uses. Some of them are required, some are
not. Use your common sense to determine which ones are. Once you have an admin
set up, the admin can create invite links to invite other users.

Once you are logged in as the administrator, you can create invite links for
other users by navigating to `/invite`. A link will automatically generate.

### Configuration

You will then need to supply some other configuration directives in 
`server/configuration.js`. Everything there is pretty self-explanatory.

### Running ParanoYak

You can run ParanoYak with `npm start` or `/paranoyak/server/main.js`. Make
sure there is an opening in your firewall for port 443 (the default port for
HTTPS traffic), and optionally, but preferrably port 80 (the default port for
unencrypted HTTP traffic) as well. Note that, if a user connects to the 
unencrypted page, he will be immediately redirected to the encrypted page.
The unencrypted page exists just for convenience.

You might need to run it as administrator, but I can't remember.

## Features

* Configurable email alerts for administrators
* Configurable logging and log archiving
* Configurable emojis, accessible via words prefixed with the dollar sign (i.e. `$shrek`)
* Twitter connectivity
* Commands, accessible via words prefixed with the exclamation point (i.e. `tweet`)
* Paranoiac monitoring of the surrounding operating system
* User profile pictures

## Technical Details

* Uses NodeJS on the back end
* Users AngularJS on the front end
* Meant only for Linux, but can run on Mac OS devices.

## Todo

- [ ] Multi-session support
- [ ] More monitoring of the surrounding file system
- [ ] Monitoring of network connectivity

## See Also

* [CertBot](https://certbot.eff.org/)
* [Let's Encrypt](https://letsencrypt.org/)

## Contact Me

If you would like to suggest fixes or improvements on this library, please just
comment on this on GitHub. If you would like to contact me for other reasons,
please email me at [jonathan@wilbur.space](mailto:jonathan@wilbur.space). :boar: