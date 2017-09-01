'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs'),
      os = require('os');

// Load our modules
const utils = __require('libs/utils'),
      config = require('../config')();

module.exports = function(answers) {

  // Variables
  let file = path.join(config.directories.settings, 'settings.json');

  // Build the base settings object
  let settings = {
    language: answers.language,
    platform: {},
    server: {
      enable: true,
      port: 3001,
      address: '0.0.0.0'
    },
    video: {
      formats: answers.formats
    }
  };
  
  // Add os specific settings
  settings.platform[os.platform()] = {
    root: answers.root,
    temp: answers.temp,
    directories: {
      show: answers.show,
      movie: answers.movie
    }
  };

  // Write the settings object
  fs.writeFileSync(file, JSON.stringify(settings, null, 4));
};
