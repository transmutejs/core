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
  }
});

// Export for future use
module.exports = i18n;
