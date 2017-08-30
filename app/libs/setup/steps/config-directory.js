'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs');

// Load modules
const config = require(path.join(__base, 'libs/setup/config'))();

module.exports = {
  type: 'input',
  name: 'directory',
  message: 'Where would you like me to put them?\n',
  default: config.directories.settings,
  when: () => {
    console.log('\x1BcI store config and cache files that you may want to edit from time to time.\n');
    return true;
  },
  validate: (val) => {

    // Resolve it
    val = path.resolve(val);

    // Get parent
    let parent = path.resolve(path.join(val, '../'));

    // Exists as file, can't do anything
    if ( fs.existsSync(val) && fs.lstatSync(val).isFile() ) {
      return 'That path exists...and is a file!';
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
      fs.mkdirSync(val);

      // Update config
      config.directories.settings = val;
      config.set({directories: config.directories});

      // Let them know
      return fs.existsSync(val) || 'Failed to create the requested directory';
    }

    // We're done here
    return 'Parent directory doesn\'t exist, nice try though';
  }
};