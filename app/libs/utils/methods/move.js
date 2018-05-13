'use strict';

// Load requirements
const fs = require('fs'),
      path = require('path'),
      progress = require('progress'),
      filesize = require('filesize'),
      moment = require('moment');

// Add duration formatting to moment
require('moment-duration-format');

// Load libraries
const logger = __require('libs/log');

/* istanbul ignore next */
module.exports = function(source, dest) {
  return new Promise((resolve, reject) => {

    // Load utils within promise, otherwise circular dep
    let utils = __require('libs/utils');

    // Check paths
    if ( ! source || ! dest ) {
      return reject('Invalid paths provided');
    }

    // Resolve them
    source = path.resolve(source);
    dest = path.resolve(dest);

    // Are source and dest the same?
    if ( source === dest ) { return resolve(); }

    // Otherwise, lets move it
    return fs.stat(source, (err, stat) => {

      // Check for errors
      if ( err ) { return reject(err); }

      // Variables
      const size = stat.size;
      let copied = 0,
          percent = 0,
          started = moment(),
          last = new Date(),
          moved = 0;

      // Create a file handler for source
      const stream = fs.createReadStream(source);

      // Create the progress bar
      let bar = utils.progressBar(lang('utils.move.ui.progress'), 100);

      // Handle progress update
      stream.on('data', (buffer) => {
        // Run every second
        if ( new Date() - last < 1000 ) {
          moved += buffer.length;
          return;
        }

        // Add to total
        moved += buffer.length;
        
        // Calculate percentage
        copied += moved;
        percent = ( ( copied / size ) * 100 );

        // Calculate etas
        let speed = moved.toFixed(3);
        let seconds = ( 100 - percent ) / 100 * size * ( 1 / speed );
        let eta = moment.duration(( seconds === Infinity ? 0 : seconds ), 'seconds');
        let elapsed = moment.duration(moment().diff(started), 'milliseconds');

        // Build progress object
        let progress = {
          percent: percent.toFixed(2),
          speed: utils.bytesToSize(moved, 2),
          rawSpeed: moved,
          taken: elapsed.format('mm:ss', {trim: false, forceLength: true}), // elapsed is reserved by progress bar
          estimate: eta.format('mm:ss', {trim: false, forceLength: true})
        };

        // Update progress bar
        bar.update(( percent / 100 ), progress);

        // Update socket users
        this.server().socket.emit('copy progress', {
          raw: moved,
          speed: progress.speed,
          eta: progress.estimate,
          taken: progress.taken,
          percent: progress.percent + '%',
          transfer: filesize(copied)
        });

        // Reset for next update
        last = new Date();
        moved = 0;
      });

      // Move completed
      stream.on('end', () => {
        
        // Remove original
        fs.unlinkSync(source);

        // Update bar to 100% and close
        bar.update(100);
        bar.terminate();

        // Return to sender
        return resolve();
      });

      // Update user
      logger.info('Moving "{green:%s}"', path.basename(source));

      // Start piping the data to the destination
      stream.pipe(fs.createWriteStream(dest));
    });
  });
};
