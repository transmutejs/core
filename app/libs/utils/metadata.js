'use strict';

// Load requirements
const ffmpeg = require('fluent-ffmpeg'),
      fs = require('fs');

// Gets the AV metadata for a given file path
module.exports = function(file) {
  return new Promise((resolve, reject) => {

    // Check that the file exists
    if ( ! fs.existsSync(file) ) {
      return reject(['"' + file + '" does not exist']);
    }

    // Get metadata
    ffmpeg.ffprobe(file, function(err, metadata) {

      if ( err !== null ) {
        return reject([err]);
      }

      return resolve(metadata);
    });
  });
};
