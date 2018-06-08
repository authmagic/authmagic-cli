const program = require('commander');
const rimraf = require('rimraf');
const {
  uninstallCore,
  uninstallTheme,
  uninstallPlugin,
} = require('./utils/functions');
const {
  read,
  write,
  init,
  install,
} = require('./utils/helpers');

program
  .command('init')
  .action(() => init(emptyDescription));

program
  .command('init-example')
  .action(() => init(exampleDescription));

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

program.parse(process.argv);