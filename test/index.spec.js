'use strict';

// Load requirements
const glob = require('glob'),
      path = require('path'),
      fs = require('fs');

// Helper to avoid a lot of directory traversing
global.__base = path.resolve(__dirname + '/../') + '/app/';

// Define the config directory
let configDir = path.resolve('./config');

// Create config directory if we don't have one
if ( ! fs.existsSync(configDir) ) {
  fs.mkdirSync(configDir);
}

// Describe the application
describe('Transmute', () => {

  // Load the sub specs to test
  glob.sync('./test/*/*.spec.js').forEach((file) => {
    require(path.resolve(file));
  });

});
