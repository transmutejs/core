'use strict';

// Load our requirements
const i18n = require('i18n'),
      path = require('path'),
      logger = require('../log');

// Variables
let localeDir = path.resolve('./locales');

// Configure the localization engine
i18n.configure({
  locales: require('./available-locales')(localeDir),
  defaultLocale: 'en',
  directory: localeDir,
  syncFiles: true,
  autoReload: true,
  register: global,
  api: {
    '__': 'lang',
    '__n': 'plural'
  },
  logDebugFn: (msg) => {
    return logger.debug(msg);
  }, 
  logWarnFn: (msg) => {
    return logger.warn(msg);
  },
  logErrorFn: (msg) => {
    return logger.error(msg);
  }
});

// Set the default locale
i18n.setLocale(( process.env.LANG !== undefined ? process.env.LANG : 'en' ));

// Export for future use
module.exports = i18n;
