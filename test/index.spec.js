'use strict';

// Load requirements
const glob = require('glob'),
      path = require('path');

// Run preflight checks
require('./pre.index.spec.js')();

// Describe the application
describe('Transmute', () => {

  // Load the sub specs to test
  glob.sync('./test/*/*.spec.js').forEach((file) => {
    require(path.resolve(file));
  });

});
