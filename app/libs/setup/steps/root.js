'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs');

// Load our modules
const utils = __require('libs/utils'),
      i18n = __require('libs/locale'),
      config = require('../config')();

module.exports = {
  type: 'input',
  name: 'root',

  // Hacky way to change the language if changed in when callback
  message: () => { return lang('setup.root.question'); },

  when: (answers) => {

    // Until we get validation on lists, this has to go here
    if ( i18n.getLocale() !== answers.language ) {
      i18n.setLocale(answers.language);
    }

    // This part needs a lot more clarification than I'd like
    let msg = lang('setup.root.message.parts') + '\n\n' +
              lang('setup.root.message.example') + '\n\n' +
              lang('setup.root.message.notice');

    // Output it
    utils.output(lang('setup.root.title'), msg, 3, 6);

    return true;
  },
  validate: (val, answers) => {

    if ( val === '' ) {
      return lang('setup.root.validation.empty');
    }

    if ( ! val.match(/[/|\/]$/) ) {
      return lang('setup.root.validation.slash');
    }

    if ( ! path.isAbsolute(val) ) {
      return lang('setup.root.validation.absolute');
    }

    if ( ! fs.existsSync(val) || ! fs.lstatSync(val).isDirectory() ) {
      return lang('setup.root.validation.not_found');
    }

    return true;
  }
};
