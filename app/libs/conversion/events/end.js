'use strict';

// Load libraries
const logger = require('../../log');

// On conversion completion
module.exports = function(stdout, stderr, job) {

  // Set the progress bar to 100%
  this.progressBar.update(1);

  // Close progress bar
  this.progressBar.terminate();

  // DEBUG
  logger.info('Complete');

};
