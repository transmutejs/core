'use strict';

// Set the required bitrate or constant rate for video
module.exports = function(command, file, options, metadata, details) {
  return new Promise((resolve, reject) => {

    // Variables
    let streams = command.streams;

    // Assign video stream, no looping since we're only using one
    command.outputOptions('-map', streams.video[0].input + ':' + streams.video[0].index);

    // Loop available audio streams
    streams.audio.forEach((stream, i) => {

      // Variables
      let audioTitle = this.utils.getStreamTitle(stream);
      let normalizedLanguage = this.utils.normalizeStreamLanguage(stream);

      // Map the output
      command.outputOptions('-map', stream.input + ':' + stream.index);
      
      // No audio title, create one
      if ( ! ( audioTitle ) ) {

        let channels = this.utils.getFormatedChannels(stream.channels);
        audioTitle = normalizedLanguage + ' ' + this.utils.capitalize(stream.codec_name) + ( ( stream.profile && stream.profile !== 'unknown' ) ? ( ' ' + stream.profile ) : '' ) + ' (' + channels + ')';
        command.outputOptions('-metadata:s:a:' + stream.index, 'title="' + audioTitle + '"');
      }

      // Set default audio
      if ( stream.index == '0' ) {
        command.outputOptions('-metadata:s:' + stream.input + ':' + stream.index, 'DISPOSITION:default=1');
      }

      // Build additional information
      let extraInfo = {
        title: audioTitle,
        language: normalizedLanguage,
        codec: stream.codec_long_name,
        channels: stream.channels
      };

      if ( stream.profile ) {
        extraInfo.profile = stream.profile;
      } else {
        extraInfo['bit-depth'] = stream.bits_per_raw_sample;
      }
    });

    // Check if we want subtitles
    if ( options.subtitles ) {
      streams.subtitles.forEach((stream, i) => {

        // Handle native language
        let normalizedLanguage = this.utils.normalizeStreamLanguage(stream);
        if ( normalizedLanguage === this.utils.normalizeLanguage(options.language) ) {
          let defaultSubtitleIndex = stream.index;
        }

        // Bind the output
        command.outputOptions('-map', stream.input + ':' + stream.index);
        
        // Assign a title
        if ( ! this.utils.getStreamTitle(stream) ) {
          command.outputOptions('-metadata:s:' + stream.input + ':' + stream.index, 'title=' + normalizedLanguage);
        }
        
        // Map as default
        command.outputOptions('-metadata:s:' + stream.input + ':' + stream.index, 'DISPOSITION:default=0');
      });
    }

    // Other streams (Attachments: fonts, pictures, etc.)
    streams.other.forEach((stream, i) => {
      command.outputOptions('-map', stream.input + ':' + stream.index);
    });

    return resolve();
  });
};
