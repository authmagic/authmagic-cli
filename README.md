authmagic-cli
========================
CLI tool for <a href="https://github.com/authmagic/authmagic">authmagic</a> - reusable, expandable authorization service which could be used for project initialization, core/plugins/theme installation..

Commands list
-----------
### init
Creates an empty configuration file.

#### Options:
-e, --example - creates predefined example configuration file, so you could try authmagic quickly.

### install [name] [source]
Installs module. Similar to npm install. If name wasn't provided it will install everything based on the configuration file. If no source provided would check the module via npm.

#### Optional params:
name - package name

source - location of the package (git or filesystem)

#### Options:
-p, --plugin - Uninstall plugin

-c, --core - Uninstall core

-t, --theme - Uninstall theme

### uninstall [name]
Installs module. Similar to npm install.

#### Optional params:
name - package name

#### Options:
-p, --plugin - Uninstall plugin
-c, --core - Uninstall core
-t, --theme - Uninstall theme

### clear
Uninstalls all plugins and removes configuration file.


Configuration file
-----------
authmagic-cli allows to boot up authorization service with a command line.
```
module.exports = {
  "core": {
    "name": "authmagic-timerange-stateless-core",
    "source": "../authmagic-timerange-stateless-core"
  },
  "plugins": {
    "authmagic-email-plugin": {
      "source": "../authmagic-email-plugin"
    }
  },
  "params": {
    "authmagic-email-plugin": {
      "isTest": true,
      "mailer": {
        "auth": {
          "user": "",
          "pass": ""
        },
        "host": "smtp.ethereal.email",
        "port": 587,
        "secure": false
      },
      "from": "AuthMailer",
      "subject": "Your Magic Link"
    },
    "authmagic-timerange-stateless-core": {
      "duration": 300,
      "key": "ad6de0e6c809b89b",
      "sendKeyPlugin": "authmagic-email-plugin",
      "expiresIn": 1200
    }
  },
  "port": 3000,
  "theme": {
    "name": "authmagic-link-email-phone-bootstrap-theme",
    "source": "../authmagic-link-email-phone-bootstrap-theme"
  }
};
```
