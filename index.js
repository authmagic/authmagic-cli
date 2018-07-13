const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const program = require('commander');
const shell = require('shelljs');
const {ncp} = require('ncp');
const rimraf = require('rimraf');
const packageName = 'authmagic.js';
const authMagicEngine = 'authmagic';

const emptyDescription = {
  core: {},
  plugins: {},
  params: {},
  port: 3000,
};

const exampleDescription = Object.assign({}, emptyDescription, {
  core: {name: 'authmagic-timerange-stateless-core'},
  theme: {name: 'authmagic-link-email-phone-bootstrap-theme'},
  plugins: {'authmagic-email-plugin': {name: 'authmagic-email-plugin'}},
});

function startAuthmagic() {
  shell.exec('node ./node_modules/authmagic/app.js');
}

function write(obj) {
  fs.writeFileSync('./'+packageName, 'module.exports = ' + JSON.stringify(obj, null, 2) + ';');
}

function read() {
  if(!fs.existsSync('./'+packageName)) {
    return false;
  }

  try {
    return require(path.resolve('./'+packageName));
  } catch(e) {
    return false;
  }
}

function init(content) {
  write(content);
  install();
  shell.exec(`npm install ${authMagicEngine} --save`);
}

function createStaticIfDoestExist() {
  const dir = './static';

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
}

function populateParams(packageName) {
  const config = read();
  const file = `./node_modules/${packageName}/params.js`;
  if(config.params.hasOwnProperty(packageName)) {
    console.log(`params for ${packageName} are already defined`);
    return false;
  }

  if(!fs.existsSync(file)) {
    console.log(`no params were predefined for ${packageName}`);
    return false;
  }

  config.params[packageName] = require(path.resolve(file));
  write(config);
  return true;
}

function populateStatic(packageName, cb, destination) {
  if(!destination) {
    destination = packageName;
  }

  if(!fs.existsSync(`./node_modules/${packageName}/static`)) {
    return false;
  }

  if(fs.existsSync(`./static/${destination}`)) {
    console.log(`static files for ${packageName} are already defined`);
    return false;
  }

  createStaticIfDoestExist();
  ncp(`./node_modules/${packageName}/static`, `./static/${destination}`, cb);
}

function install() {
  const {plugins, core, theme} = read();

  if(plugins) {
    for(let i=0, pluginNames = Object.keys(plugins); i<pluginNames.length; i++) {
      const name = pluginNames[i];
      const {source} = plugins[name];
      shell.exec(`npm install ${source?source:name} --save`);
      populateParams(name);
      populateStatic(name);
    }
  }

  if(core) {
    const {name, source} = core;
    shell.exec(`npm install ${source?source:name} --save`);
    populateParams(name);
  }

  if(theme) {
    const {name, source} = theme;
    shell.exec(`npm install ${source?source:name} --save`);
    populateStatic(name);
  }
}

function uninstallPlugin(name) {
  const config = read();
  delete config.plugins[name];
  delete config.params[name];
  shell.exec(`npm uninstall ${name}`);
  write(config);
}

function uninstallCore() {
  const config = read();
  const coreName = config.core;
  if(config.params) {
    delete config.params[coreName];
  }

  delete config.core;
  shell.exec(`npm uninstall ${coreName}`);
  write(config);
}

function uninstallTheme() {
  const config = read();
  const themeName = config.theme;
  if(config.params) {
    delete config.params[themeName];
  }
  delete config.theme;
  shell.exec(`npm uninstall ${themeName}`);
  write(config);
}

program
  .command('init')
  .option('-e, --example', 'Initialize example configuration file')
  .action(function(cmd) {
    if(cmd.example) {
      init(exampleDescription);
    } else {
      init(emptyDescription);
    }
  });

program
  .command('install [name] [source]')
  .option('-p, --plugin', 'Install plugin')
  .option('-c, --core', 'Install core')
  .option('-t, --theme', 'Install theme')
  .action(function(name, source, cmd) {
    const config = read();
    if(!config) {
      init();
    }

    if(!name) {
      install();
      return;
    }

    if(config.plugins.hasOwnProperty(name) || config.core.name === name) {
      console.log(`${name} already listed`);
      return;
    }

    if(cmd.core || name.endsWith('-core')) {
      config.core = source ? {name, source} : {name};
    } else if(cmd.theme || name.endsWith('-theme')) {
      config.theme = source ? {name, source} : {name};
    } else {
      config.plugins[name] = {source};
    }

    write(config);
    install();
  });

program
  .command('uninstall [name]')
  .option('-p, --plugin', 'Uninstall plugin')
  .option('-c, --core', 'Uninstall core')
  .option('-t, --theme', 'Uninstall theme')
  .action(function(name, cmd) {
    const config = read();
    if(!config) {
      console.log(`AuthMagic is not initialized`);
      return;
    }

    if(!name && !cmd.core) {
      console.log(`No package name provided`);
      return;
    }

    if(cmd.core || name.endsWith('-core')) {
      uninstallCore();
    } else if(cmd.theme || name.endsWith('-theme')) {
      uninstallTheme();
    } else {
      uninstallPlugin(name);
    }
  });

program
  .command('clear')
  .action(function() {
    const {plugins} = read();

    if(plugins) {
      for(let i=0, pluginNames = Object.keys(plugins); i<pluginNames.length; i++) {
        const name = pluginNames[i];
        uninstallPlugin(name);
      }
    }

    uninstallCore();
    uninstallTheme();
    rimraf('./authmagic.js', () => rimraf('./static', () => console.log('clear operation finished')));
  });

program
  .command('start')
  .action(startAuthmagic);

if(process.argv.length < 3) {
  startAuthmagic();
} else {
  program.parse(process.argv);
}