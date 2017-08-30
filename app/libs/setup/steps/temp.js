'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs'),
      os = require('os');

// Load our modules
const utils = require(__base + 'libs/utils'),
      config = require('../config')();

module.exports = {
  type: 'input',
  name: 'temp',
  message: utils.colorString(lang('setup.temp.question')),
  default: os.tmpdir() + ( os.platform() === 'win32' ? '\\' : '/' ),
  when: () => {
    utils.output(lang('setup.temp.title'), lang('setup.temp.message.why') + '\n\n' + lang('setup.temp.message.options'), 4, 6);
    return true;
  },
  validate: (val, answers) => {

    val = val.trim();

    if( val === '') {
      return true;
    }

    if ( ! val.match(/[/|\/]$/) ) {
      return lang('setup.temp.validation.slash');
    }

    if ( ! fs.existsSync(val) || ! fs.lstatSync(val).isDirectory() ) {
      return lang('setup.temp.validation.not_found');
    }

    return true;
  }
};
