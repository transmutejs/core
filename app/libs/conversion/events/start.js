'use strict';

// Load requirements
const progress = require('progress');

// Load libraries
const utils = __require('libs/utils'),
      logger = __require('libs/log');

// On conversion start
module.exports = function(cmd, job, metadata) {

  // Verbose
  logger.debug('Spawned ffmpeg with cmd:\n\n' + cmd);

  // Notify user
  logger.info('Starting conversion of "{green:%s}".', job.basename);

  // Update any socket connections
  utils.socket.emit('conversion start', job);

  // Create a progress bar
  this.progressBar = new progress(
    utils.colorString(lang('conversion.ui.progress')), {
    complete: '=',
    incomplete: ' ',
    head: '>',
    clear: true,
    renderThrottle: 0,
    total: 100,
    width: 30
  });
};
