'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs');

// Load our modules
const utils = __require('libs/utils'),
      config = require('../config')();

module.exports = {
  type: 'input',
  name: 'movie',
  message: lang('setup.movie.question'),
  default: 'Movies/',
  when: () => {
    return true;
  },
  validate: (val, answers) => {

    if ( ! val.match(/[/|\/]$/) ) {
      return lang('setup.movie.validation.slash');
    }

    let dir = path.normalize(path.join(answers.root, val));

    if ( ! fs.existsSync(dir) || ! fs.lstatSync(dir).isDirectory() ) {
      return lang('setup.movie.validation.not_found');
    }

    return true;
  }
};
