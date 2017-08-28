'use strict';

const previewTime = 30;

// Preview mode, a small sample output from the middle of the video
module.exports = function(command, file, options, metadata, details) {
  return new Promise((resolve, reject) => {

    if ( options.preview ) {
      command.seekInput(metadata.format.duration / 2)
             .duration(previewTime);
    }

    return resolve();
  });
};
