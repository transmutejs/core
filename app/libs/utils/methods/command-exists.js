'use strict';

// Load requirements
let exists = require('command-exists').sync;

// Detects if a command is available in PATH
module.exports = function(cmd) {

  return exists(cmd);
};
