'use strict';

// Load libraries
const logger = __require('libs/log'),
      utils = __require('libs/utils');

// On conversion error
module.exports = function(err, stdout, stderr, job, metadata, resolve, reject) {

  // Close progress bar
  this.progressBar.terminate();

  // DEBUG
  logger.error(err);

  // Update any socket connections
  utils.socket.emit('conversion error', err);

  // Send back to main thread with error
  return reject(err);
};
