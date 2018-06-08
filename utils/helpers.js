const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const packageName = 'authmagic.js';
const authMagicEngine = '../../authmagic';

function init(content) {
  write(content);
  install();
  shell.exec(`npm install ${authMagicEngine} --save`);
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

function write(obj) {
  fs.writeFileSync('./'+packageName, 'module.exports = ' + JSON.stringify(obj, null, 2) + ';');
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

module.exports = {
  init,
  read,
  write,
  install,
}