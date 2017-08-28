'use strict';

// High efficency audio conversion
module.exports = function(command, file, options, metadata, details) {
  return new Promise((resolve, reject) => {

    // Skip audio transcoding
    if ( ! options.he.audio ) {
      return resolve();
    }

    // Loop available audio streams
    command.streams.audio.forEach((stream, i) => {

      // Skip if we have lossless audio or aren't forcing it
      if ( stream.codec_name !== 'flac' || options.he.force ) {

        // Assign new decoder for audio
        command.outputOptions('-c:a:' + i, 'libopus');
        command.outputOptions('-frame_duration', 60);

        // Downsample channels to 2.1
        if ( options.he.downmix && stream.channels > 3 ) {
          command.audioChannels(2).audioFilters('aresample=matrix_encoding=dplii');
          stream.channels = 2;
        }

        // Calculate bitrate
        let bitrate = options.he.bitrate * stream.channels;
        command.outputOptions('-b:a:' + i, bitrate + 'k');

        // Handle setting a new title
        let audioTitle = this.utils.getStreamTitle(stream);
        let normalizedLanguage = this.utils.normalizeStreamLanguage(stream);

        // No title, set one
        if ( ! ( audioTitle ) ) {
          
          let channelsFormated = this.utils.getFormatedChannels(stream.channels);
          audioTitle = normalizedLanguage + ' OPUS (' + channelsFormated + ')';
          command.outputOptions('-metadata:s:a:' + stream.index, 'title="' + audioTitle + '"');
        }
      }
    });

    return resolve();
  });
};
