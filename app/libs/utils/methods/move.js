'use strict';

// Load requirements
const fs = require('fs'),
      path = require('path'),
      progress = require('progress'),
      filesize = require('filesize');

// Load libraries
const logger = __require('libs/log');

module.exports = function(source, dest) {
  return new Promise((resolve, reject) => {

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
      let copied = 0, percent = 0;

      // Create a file handler for source
      const stream = fs.createReadStream(source);

      // Create the progress bar
      let bar = this.progressBar(lang('utils.move.ui.progress'), size);

      // Handle progress update
      stream.on('data', (buffer) => {
        
        // Update progress bar
        bar.tick(buffer.length);

        // Calculate percentage
        copied += buffer.length;
        let pct = ( ( copied / size  ) * 100 );

        // Throttle copy updates
        if ( ( pct - percent ) > 0.5 ) {
          
          // Update socket users
          this.server().socket.emit('copy progress', {
            speed: buffer.length,
            percent: pct.toFixed(2) + '%',
            transfer: filesize(copied)
          });

          // Stop additional updates
          percent = pct;
        }
      });

      // Move completed
      stream.on('end', () => {
        
        // Remove original
        fs.unlinkSync(source);

        // Update bar to 100% and close
        bar.update(1);
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
