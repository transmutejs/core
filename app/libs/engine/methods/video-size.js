'use strict';

// Resize the output video, options can be formatted as - 50%, 720x?, 640x480, etc.
module.exports = function(command, file, options, metadata, details) {
  return new Promise((resolve, reject) => {

    if ( ! options.video ) {
      return resolve();
    }
    
    if ( options.video.size ) {
      command.size(options.video.size);
    }

    return resolve();
  });
};
