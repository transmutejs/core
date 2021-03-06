'use strict';

// Load requirements
const path = require('path');

// Load our modules
const utils = __require('libs/utils'),
      i18n = __require('libs/locale'),
      config = require('../config')();

// Get the available locales
let localesDir = path.resolve(path.join(__base, '../locales')),
    locales = __require('libs/locale/available-locales')(localesDir);

module.exports = {
  type: 'list',
  name: 'language',
  message: lang('setup.language.question'),
  choices: locales,
  default: ( locales.length > 0 ? locales[0] : 'en' ),
  when: () => {

    // No point in asking with just the one
    if ( locales.length <= 1 ) {
      return false;
    }

    // Okay to ask
    utils.output(lang('setup.language.title'), lang('setup.language.message'), 2, 6);
    return true;
  },
  validate: (val) => {

    // Check the language exists
    if ( ! locales.includes(val) ) {
      return lang('setup.language.validation.not_found');
    }

    // Set the locale
    i18n.setLocale(val);

    return true;
  }
};
