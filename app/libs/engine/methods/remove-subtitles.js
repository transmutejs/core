'use strict';

// Force removal of subtitles streams
module.exports = function(command, file, options, metadata, details) {
  return new Promise((resolve, reject) => {

    if ( ! options.subtitles ) {
      command.outputOptions('-sn');
    }

    return resolve();
  });
};
