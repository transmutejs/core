'use strict';

// Load requirements
const fs = require('fs'),
      path = require('path'),
      os = require('os');

// Load modules
const utils = require(__base + 'libs/utils'),
      logger = require(__base + 'libs/log');

// Variables
const config = require(path.join(__base, '../config/config')),
      settingsFile = path.join(config.directories.settings, 'settings.json');

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
let obj = require(settingsFile);
obj.directory = config.directories.settings;
let settings = new buildSettings(obj);

// Export the object
module.exports = settings;
