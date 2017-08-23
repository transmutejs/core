// https://gist.github.com/yoavniran/1e3b0162e1545055429e

'use strict';

// Load requirements
const glob = require('glob'),
      path = require('path');

// Describe the application
describe('Transmute', () => {

  // Load the sub specs to test
  glob.sync('./test/*/*.spec.js').forEach((file) => {
    require(path.resolve(file));
  });

});
