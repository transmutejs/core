'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs');

// Variables
const config = require(path.join(__base, '../config/config')),
      settingsFile = path.join(config.directories.settings, 'settings.json');

// Create an object
let obj = require(settingsFile);
obj.directory = config.directories.settings;

// Export the object
module.exports = obj;
