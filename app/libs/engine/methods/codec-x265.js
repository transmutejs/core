'use strict';

// Assign x265 specific settings
module.exports = function(command, file, options, metadata, details) {
  return new Promise((resolve, reject) => {

    // Do we need to add the options
    if ( options.video.codec.match(/265|HEVC/gi) ) {

      // Variables
      let str = '',
          opts = require('../data/codec-x265');

      // Parse the object into an ffmpeg compatible string
      Object.keys(opts).forEach((key) => {
        str += ( str.length > 0 ? ':' : '' ) + key + ( opts[key] !== null ? '=' + opts[key] : '' );
      });

      // Add to our command
      command.outputOptions('-x265-params', str);
    }

    return resolve();
  });
};
