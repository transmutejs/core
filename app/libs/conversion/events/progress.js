'use strict';

// Load requirements
const fs = require('fs'),
      moment = require('moment'),
      filesize = require('filesize');

// Add duration formatting to moment
require('moment-duration-format');

// On progress update
module.exports = function(progress, job, metadata) {

  // Variables
  let size    = fs.statSync(job.temp).size,
      speed   = ( progress.currentFps / job.framerate ).toFixed(3),
      seconds =  (100 - progress.percent ) / 100 * metadata.format.duration * ( 1 / speed ),
      eta     = moment.duration(( seconds === Infinity ? 0 : seconds ), 'seconds'),
      elapsed = moment.duration(moment().diff(this.started), 'milliseconds');

  // Update estimated size
  job.size.estimate = {
    raw: ( progress.percent > 10 ? ( size / progress.percent * 100 ) : '' ),
    formatted: ( progress.percent > 10 ? filesize( size / progress.percent * 100 ) : '' )
  };

  // Update current file size
  job.size.current = {
    raw: size,
    formatted: ( size > 0 ? filesize(size) : '' )
  };

  // Update progress details
  job.progress = {
    percent: progress.percent,
    frames: progress.currentFps,
    time: progress.timemark.split('.')[0],
    speed: speed,
    taken: elapsed.format('mm:ss', {trim: false, forceLength: true}), // elapsed is reserved by progress bar
    estimate: eta.format('mm:ss', {trim: false, forceLength: true}),
    size: job.size.current.formatted, // Duplicated to show on progress bar
    reduction: ( progress.percent > 10 ? ( ( size / progress.percent * 100 ) / job.size.original.raw * 100 ).toFixed(0) : 0 )
  };

  // Update progress bar
  this.progressBar.update(( progress.percent / 100 ), job.progress);
};