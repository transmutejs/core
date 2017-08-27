'use strict';

// Load requirements
const glob = require('glob'),
      path = require('path'),
      fs = require('fs');

// Describe the application
describe('Transmute', () => {

  // Load the sub specs to test
  glob.sync('./test/*/*.spec.js').forEach((file) => {
    require(path.resolve(file));
  });

});
