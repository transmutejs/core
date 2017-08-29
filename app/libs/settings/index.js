'use strict';

// Load requirements
const fs = require('fs'),
      path = require('path'),
      os = require('os');

// Load modules
const utils = require('../utils'),
      logger = require('../log');

// Variables
const configDir = path.resolve('./config'),
      settingsFile = path.join(configDir, 'settings.json');

// Create directory
if ( ! fs.existsSync(configDir) ) {
  fs.mkdirSync(configDir);
}

// Create example settings
if ( ! fs.existsSync(settingsFile) ) {
  fs.writeFileSync(settingsFile, JSON.stringify(require('./data/sample'), null, 4));
  logger.warn('Created a new settings file in config, please customise these settings before running again');
  process.exit(0);
}

// Define the recursive settings object builds
const buildSettings = function(rules) {    
  for ( let prop in rules ) {
    Object.defineProperty(this, prop, {
      get: function() { // jshint ignore:line
        if ( rules[prop] !== null && typeof rules[prop] === 'object' && ! Array.isArray(rules[prop]) )
          return new buildSettings(rules[prop]);
        else
          return rules[prop];
      }
    });
  }
};

// Create a dynamic object
let settings = new buildSettings(require(settingsFile));

// Export the object
module.exports = settings;
