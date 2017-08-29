'use strict';

// Assign the audio codec to use
module.exports = function(command, file, options, metadata, details) {
  return new Promise((resolve, reject) => {

    // Are we copying source?
    if ( options.audio.codec === 'copy' ) {

      // Get the codec data from the audio stream
      options.audio.codec = command.streams.audio[0].codec_name;
    }

    // Get a list of the available codecs
    command.getAvailableCodecs((err, codecs) => {

      // Check we have this one and can encode it
      if ( ! codecs[options.audio.codec] || ! codecs[options.audio.codec].canEncode ) {
        return reject('Codec "' + options.audio.codec + '" is not available for encoding.');
      }

      // Assign audio codec
      command.audioCodec(options.audio.codec);

      return resolve();
    });
  });
};
