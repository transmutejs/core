'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs'),
      assign = require('deep-assign');

module.exports = function() {

  // Build base class
  let config = {

    setup: false,

    directories: {
      config: path.resolve(__base + '../config'),
      settings: path.resolve(__base + '../config')
    },

    file: null,

    get: function() {
      return ( this.exists() ? JSON.parse(fs.readFileSync(this.file, 'utf8')) : {} );
    },

    set: function(config) {
      fs.writeFileSync(this.file, JSON.stringify(assign(this.get(), config), null, 4));
    },

    exists: function() {
      return fs.existsSync(this.file);
    }
  };

  // Set file path
  config.file = path.join(config.directories.config, 'config.json');

  // Try to create the config directory
  if ( ! fs.existsSync(config.directories.config) ) {
    fs.mkdirSync(config.directories.config);

    if ( ! fs.existsSync(config.directories.config) ) {
      throw new Error('Failed to create config directory');
    }
  }

  // Create config file
  if ( ! config.exists() ) {
    config.set({setup: config.setup, directories: config.directories});
  
  // Merge existing config into object
  } else {
    config = assign(config, config.get());
  }

  return config;
};
