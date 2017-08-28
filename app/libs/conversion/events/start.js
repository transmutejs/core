'use strict';

// Load requirements
const progress = require('progress');

// Load libraries
const utils = require('../../utils'),
      logger = require('../../log');

// On conversion start
module.exports = function(cmd, job, metadata) {

  // Verbose
  logger.debug('Spawned ffmpeg with cmd:\n\n' + cmd);

  // Notify user
  logger.info('Starting conversion of "{green:%s}".', job.basename);

  // Create a progress bar
  this.progressBar = new progress(
    utils.colorString(lang('PROGRESS.CONVERSION')), {
    complete: '=',
    incomplete: ' ',
    head: '>',
    clear: true,
    renderThrottle: 0,
    total: 100,
    width: 30
  });
};
