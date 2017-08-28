'use strict';

// Load libraries
const logger = require('../../log');

// On conversion error
module.exports = function(err, stdout, stderr, job, metadata, resolve, reject) {

  // Close progress bar
  this.progressBar.terminate();

  // DEBUG
  logger.error(err);

  // Send back to main thread with error
  return reject(err);
};
