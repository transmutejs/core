'use strict';

// Set the required bitrate or constant rate for video
module.exports = function(command, file, options, metadata, details) {
  return new Promise((resolve, reject) => {

    if ( ! options.video ) {
      return resolve();
    }
    
    if ( options.video.bitrate !== 0 ) {
      command.videoBitrate(options.video.bitrate);
    } else if ( options.video.quality !== 0 ) {
      command.outputOptions('-crf ' + options.video.quality);
    }

    return resolve();
  });
};
