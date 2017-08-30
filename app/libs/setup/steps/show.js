'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs');

// Load modules
const utils = require(__base + 'libs/utils');

module.exports = {
  type: 'input',
  name: 'show',
  message: 'How about your TV Show location?',
  default: 'TV Shows/',
  when: () => {
    return true;
  },
  validate: (val, answers) => {

    if ( ! val.match(/[/|\/]$/) ) {
      return 'Paths must end with a slash';
    }

    if ( ! fs.existsSync(answers.root + val) || ! fs.lstatSync(answers.root + val).isDirectory() ) {
      return 'Path either does not exist or is not a directory';
    }

    return true;
  }
};
