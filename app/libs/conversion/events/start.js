'use strict';

// Load libraries
const utils = __require('libs/utils'),
      logger = __require('libs/log'),
      io = utils.server().socket;

// On conversion start
module.exports = function(cmd, job, metadata) {

  // Verbose
  logger.debug('Spawned ffmpeg with cmd:\n\n' + cmd);

  // Notify user
  logger.info('Starting conversion of "{green:%s}".', job.basename);

  // Update any socket connections
  io.emit('conversion start', job);

  // Create a progress bar
  this.progressBar = utils.progressBar(lang('conversion.ui.progress'), 100);
};
