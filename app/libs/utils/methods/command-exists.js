'use strict';

// Load requirements
let exists = require('hasbin');

// Detects if a command is available in PATH
module.exports = function(cmd) {

  return exists.sync(cmd);
};
