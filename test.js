const fs = require('fs');
const path = require('path');
const test = require('ava');
const {
  init,
  readConfig,
  write,
  install,
} = require('./utils/helpers');
const {
  createStaticIfDoesntExist,
  uninstallPlugin,
} = require('./utils/main');
const { EMPTY_DESCRIPTION, EXAMPLE_DESCRIPTION } = require('./consts/description');

test('should read config file', t => {
  const packageName = '__mocks__/authmagicTest';
  const config = readConfig(packageName);
  const expectedConfig = require('./__mocks__/authmagicTest');
  t.is(config, expectedConfig);
})

test('should write config file', t => {
  const packageName = '__mocks__/authmagicWrite';
  write(EXAMPLE_DESCRIPTION, packageName);
  const config = readConfig(packageName);
  t.deepEqual(config, EXAMPLE_DESCRIPTION);
  fs.unlinkSync(path.resolve(__dirname, './__mocks__/authmagicWrite.js'));
})

test('should init basic app', t => {
  const packageName = '__mocks__/authmagicInit';
  init(EMPTY_DESCRIPTION, packageName);
  t.pass();
  fs.unlinkSync(path.resolve(__dirname, './__mocks__/authmagicInit.js'));
})

test('should init example app', t => {
  const packageName = '__mocks__/authmagicInitExample';
  init(EXAMPLE_DESCRIPTION, packageName);
  t.pass();
  fs.unlinkSync(path.resolve(__dirname, './__mocks__/authmagicInitExample.js'));
})

test('should install app', t => {
  const packageName = '__mocks__/authmagicInstall';
  write(EXAMPLE_DESCRIPTION, packageName);
  install(packageName);
  t.pass();
  fs.unlinkSync(path.resolve(__dirname, './__mocks__/authmagicInstall.js'));
})

test('should create static dir', t => {
  createStaticIfDoesntExist();
  if (fs.existsSync('./static')) {
    t.pass();
    fs.rmdirSync('./static');
  } else {
    t.fail();
  }
})

test('should uninstall plugin', t => {
  const packageName = '__mocks__/authmagicTestUninstall';
  const name = 'authmagic-email-plugin';
  write(EXAMPLE_DESCRIPTION, packageName);
  uninstallPlugin(name, packageName);
  const config = readConfig(packageName);
  const expectedConfig = {
    core: {
      name: "authmagic-timerange-stateless-core",
      source: "../authmagic-timerange-stateless-core"
    },
    plugins: {},
    params: {},
    port: 3000,
    theme: {
      name: "authmagic-link-email-phone-bootstrap-theme",
      source: "../authmagic-link-email-phone-bootstrap-theme"
    }
  };
  t.deepEqual(config, expectedConfig);
})
