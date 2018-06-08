export const EMPTY_DESCRIPTION = {
  CORE: {},
  PLUGINS: [],
  PARAMS: {},
  PORT: 3000,
}

export const EXAMPLE_DESCRIPTION = Object.assign({}, EMPTY_DESCRIPTION, {
  CORE: {
    NAME: 'authmagic-timerange-stateless-core',
    SOURCE: '../authmagic-timerange-stateless-core',
  },
  THEME: {
    NAME: 'authmagic-link-email-phone-bootstrap-theme',
    SOURCE: '../authmagic-link-email-phone-bootstrap-theme',
  },
  PLUGINS: [
    {
      NAME: 'authmagic-email-plugin',
      SOURCE: '../authmagic-email-plugin',
    },
  ],
});
