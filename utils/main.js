const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

function createStaticIfDoesntExist() {
  const dir = './static';

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
}

function uninstallPlugin(name, packageName) {
  const config = readConfig(packageName);
  delete config.plugins[name];
  delete config.params[name];
  shell.exec(`npm uninstall ${name}`);
  write(config, packageName);
}

function uninstallCore(packageName) {
  const config = readConfig(packageName);
  const coreName = config.core;
  if(config.params) {
    delete config.params[coreName];
  }

  delete config.core;
  shell.exec(`npm uninstall ${coreName}`);
  write(config, packageName);
}

function uninstallTheme(packageName) {
  const config = readConfig(packageName);
  const themeName = config.theme;
  if(config.params) {
    delete config.params[themeName];
  }
  delete config.theme;
  shell.exec(`npm uninstall ${themeName}`);
  write(config, packageName);
}

function readConfig(packageName) {
  if(!fs.existsSync('./'+packageName+'.js')) {
    return false;
  }

  try {
    return require(path.resolve('./'+packageName+'.js'));
  } catch(e) {
    return false;
  }
}

function write(obj, packageName) {
  fs.writeFileSync('./'+packageName+'.js', 'module.exports = ' + JSON.stringify(obj, null, 2) + ';');
}

module.exports = {
  createStaticIfDoesntExist,
  uninstallPlugin,
  uninstallCore,
  uninstallTheme,
  readConfig,
  write,
};
