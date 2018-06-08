const program = require('commander');
const rimraf = require('rimraf');
const {
  uninstallCore,
  uninstallTheme,
  uninstallPlugin,
  readConfig,
  write,
} = require('./utils/main');
const {
  init,
  install,
} = require('./utils/helpers');
const {
  EMPTY_DESCRIPTION,
  EXAMPLE_DESCRIPTION
} = require('./consts/description');
const packageName = 'authmagic';

program
  .command('init')
  .action(() => init(EMPTY_DESCRIPTION));

program
  .command('init-example')
  .action(() => init(EXAMPLE_DESCRIPTION));

program
  .command('install [name] [source]')
  .option('-p, --plugin', 'Install plugin')
  .option('-c, --core', 'Install core')
  .option('-t, --theme', 'Install theme')
  .action(function(name, source, cmd) {
    const config = readConfig(packageName);
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

    write(config, packageName);
    install(packageName);
  });

program
  .command('uninstall [name]')
  .option('-p, --plugin', 'Uninstall plugin')
  .option('-c, --core', 'Uninstall core')
  .option('-t, --theme', 'Uninstall theme')
  .action(function(name, cmd) {
    const config = readConfig(packageName);
    if(!config) {
      console.log(`AuthMagic is not initialized`);
      return;
    }

    if(!name && !cmd.core) {
      console.log(`No package name provided`);
      return;
    }

    if(cmd.core || name.endsWith('-core')) {
      uninstallCore(packageName);
    } else if(cmd.theme || name.endsWith('-theme')) {
      uninstallTheme(packageName);
    } else {
      uninstallPlugin(name, packageName);
    }
  });

program
  .command('clear')
  .action(function() {
    const {plugins} = readConfig(packageName);

    if(plugins) {
      for(let i=0, pluginNames = Object.keys(plugins); i<pluginNames.length; i++) {
        const name = pluginNames[i];
        uninstallPlugin(name, packageName);
      }
    }

    uninstallCore(packageName);
    uninstallTheme(packageName);
    rimraf('./authmagic.js', () => rimraf('./static', () => console.log('clear operation finished')));
  });

program.parse(process.argv);