'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs'),
      os = require('os');

// Load modules
const utils = require(__base + 'libs/utils');

module.exports = {
  type: 'input',
  name: 'temp',
  message: 'Fantastic! Just one last thing before we move on, where is your temp directory?\n',
  default: os.tmpdir() + ( os.platform() === 'win32' ? '\\' : '/' ),
  when: () => {
    return true;
  },
  validate: (val, answers) => {

    if ( ! val.match(/[/|\/]$/) ) {
      return 'Paths must end with a slash';
    }

    if ( ! fs.existsSync(val) || ! fs.lstatSync(val).isDirectory() ) {
      return 'Path either does not exist or is not a directory';
    }

    return true;
  }
};
