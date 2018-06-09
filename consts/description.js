const EMPTY_DESCRIPTION = {
  core: {},
  plugins: {},
  params: {},
  port: 3000,
}

const EXAMPLE_DESCRIPTION = Object.assign({}, EMPTY_DESCRIPTION, {
  core: {
    name: 'authmagic-timerange-stateless-core',
    source: '../authmagic-timerange-stateless-core',
  },
  theme: {
    name: 'authmagic-link-email-phone-bootstrap-theme',
    source: '../authmagic-link-email-phone-bootstrap-theme',
  },
  plugins: {
    'authmagic-email-plugin': {
      source: '../authmagic-email-plugin',
    },
  },
});

module.exports = {
  EMPTY_DESCRIPTION,
  EXAMPLE_DESCRIPTION,
}