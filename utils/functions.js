const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const {ncp} = require('ncp');

const {
  read,
  write,
} = require('./helpers');

function createStaticIfDoesntExist() {
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

  createStaticIfDoesntExist();
  ncp(`./node_modules/${packageName}/static`, `./static/${destination}`, cb);
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

module.exports = {
  createStaticIfDoesntExist,
  populateParams,
  populateStatic,
  uninstallPlugin,
  uninstallCore,
  uninstallTheme,
}