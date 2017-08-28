'use strict';

// Load libraries
const logger = require('../../log');

// On conversion error
module.exports = function(err, stdout, stderr) {

  // DEBUG
  logger.error(err);

};
