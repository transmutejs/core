'use strict';

// Load requirements
const moment = require('moment'),
      filesize = require('filesize'),
      fs = require('fs');

// Load libraries
const logger = __require('libs/log'),
      utils = __require('libs/utils');

// On conversion completion
module.exports = function(stdout, stderr, job, metadata, resolve, reject) {

  // Calculate new filesize and duration
  let size = fs.statSync(job.temp).size,
      elapsed = moment.duration(moment().diff(this.started), 'milliseconds');

  // Set the progress bar to 100%
  this.progressBar.update(1);

  // Close progress bar
  this.progressBar.terminate();

  // Update task with completed data
  job.progress.taken = elapsed.format('mm:ss', {trim: false, forceLength: true});
  job.size.current = {raw: size, formatted: filesize(size)};
  job.size.difference = {
    raw: ( job.size.original.raw - job.size.current.raw ),
    formatted: filesize( job.size.original.raw - job.size.current.raw ),
  };

  // Calculate savings
  job.size.difference.percent = ( ( job.size.difference.raw / job.size.original.raw ) * 100 );

  // DEBUG
  logger.info('Conversion complete in %s.', job.progress.taken);

  // Update socket users
  utils.socket.emit('conversion complete', job);

  // Stats
  logger.info(
    lang('conversion.ui.complete'),
    job.size.original.formatted,
    job.size.current.formatted,
    job.size.difference.formatted,
    job.size.difference.percent.toFixed(2)
  );

  // All done
  return resolve(job);
};
