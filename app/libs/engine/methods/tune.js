'use strict';

// Tune settings, information available at:
// http://x265.readthedocs.io/en/default/presets.html#tuning
module.exports = function(command, file, options, metadata, details) {
  return new Promise((resolve, reject) => {

    if ( options.video.tuning ) {
      command.outputOptions('-tune', options.video.tuning);
    }

    return resolve();
  });
};
