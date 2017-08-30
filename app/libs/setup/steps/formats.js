'use strict';

// Load requirements
const path = require('path'),
      os = require('os');

// Load our modules
const utils = require(__base + 'libs/utils'),
      config = require('../config')();

module.exports = {
  type: 'checkbox',
  name: 'formats',
  message: lang('setup.formats.question'),
  choices: [
    {name: 'mkv', checked: true},
    {name: 'mp4', checked: true},
    {name: 'avi', checked: false},
    {name: 'mov', checked: false},
    {name: 'wmv', checked: false},
    {name: 'flv', checked: false}
  ],
  when: () => {
    utils.output(lang('setup.formats.title'), lang('setup.formats.message'), 5, 6);
    return true;
  },
  validate: function (answer) {
    
    if ( answer.length < 1 ) {
      return lang('setup.formats.validation.empty');
    }
    
    return true;
  }
};
