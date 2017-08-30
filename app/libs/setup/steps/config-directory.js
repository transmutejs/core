'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs');

// Load our modules
const utils = require(__base + 'libs/utils'),
      config = require('../config')();

module.exports = {
  type: 'input',
  name: 'directory',
  message: lang('setup.config.question'),
  default: config.directories.settings,
  when: () => {
    utils.output(lang('setup.config.title'), lang('setup.config.message'), 1, 6);
    return true;
  },
  validate: (val) => {

    // Resolve it
    val = path.resolve(val);

    // Get parent
    let parent = path.resolve(path.join(val, '../'));

    // Exists as file, can't do anything
    if ( fs.existsSync(val) && fs.lstatSync(val).isFile() ) {
      return lang('setup.config.validation.path_exists');
    }

    // Exists as directory, nothing more to do
    if ( fs.existsSync(val) && fs.lstatSync(val).isDirectory() ) {

      // Update config
      config.directories.settings = val;
      config.set({directories: config.directories});

      return true;
    }

    // Check parent directory exists
    if ( fs.existsSync(parent) && fs.lstatSync(parent).isDirectory() ) {

      // Make the directory
      try {
        fs.mkdirSync(val);
      } catch(e) {
        return lang('setup.config.validation.failed');
      }

      // Update config
      config.directories.settings = val;
      config.set({directories: config.directories});

      // Let them know
      return fs.existsSync(val) || lang('setup.config.validation.failed');
    }

    // We're done here
    return utils.colorString(lang('setup.config.validation.no_parent'));
  }
};