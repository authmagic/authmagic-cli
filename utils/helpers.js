const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const {ncp} = require('ncp');
const {
  readConfig,
  write,
  createStaticIfDoesntExist,
} = require('./main');
const authMagicEngine = '../authmagic';

function populateStatic(name, cb, destination) {
  if(!destination) {
    destination = name;
  }

  if(!fs.existsSync(`./node_modules/${name}/static`)) {
    return false;
  }

  if(fs.existsSync(`./static/${destination}`)) {
    console.log(`static files for ${name} are already defined`);
    return false;
  }

  createStaticIfDoesntExist();
  ncp(`./node_modules/${name}/static`, `./static/${destination}`, cb);
}

function populateParams(name, packageName) {
  const config = readConfig(packageName);
  const file = `./node_modules/${name}/params.js`;
  if(config.params.hasOwnProperty(name)) {
    console.log(`params for ${name} are already defined`);
    return false;
  }

  if(!fs.existsSync(file)) {
    console.log(`no params were predefined for ${name}`);
    return false;
  }

  config.params[name] = require(path.resolve(file));
  write(config, packageName);
  return true;
}

function init(content, packageName) {
  write(content, packageName);
  install(packageName);
  shell.exec(`npm install ${authMagicEngine} --save`);
}

function install(packageName) {
  const {plugins, core, theme} = readConfig(packageName);
  if(plugins) {
    for(let i=0, pluginNames = Object.keys(plugins); i<pluginNames.length; i++) {
      const name = pluginNames[i];
      const {source} = plugins[name];
      shell.exec(`npm install ${source?source:name} --save`);
      populateParams(name, packageName);
      populateStatic(name);
    }
  }

  if(core) {
    const {name, source} = core;
    shell.exec(`npm install ${source?source:name} --save`);
    populateParams(name, packageName);
  }

  if(theme) {
    const {name, source} = theme;
    shell.exec(`npm install ${source?source:name} --save`);
    populateStatic(name);
  }
}

module.exports = {
  init,
  readConfig,
  write,
  install,
}