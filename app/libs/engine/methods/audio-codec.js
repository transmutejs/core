'use strict';

 // Assign the audio codec to use
module.exports = function(command, file, options, metadata, details) {
  return new Promise((resolve, reject) => {

    command.audioCodec(options.audio.codec);

    return resolve();
  });
};
