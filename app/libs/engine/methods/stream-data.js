'use strict';

// Load utils
const logger = require('../../log');

// Builds an object of stream data to be assigned to our output
module.exports = function(command, file, options, metadata, details) {
  return new Promise((resolve, reject) => {

    // Variables
    let status = true,
        streams = {video: [], audio: [], subtitle: [], other: []};

    // Loop the available streams in source
    metadata.streams.forEach(function(stream) {

      // No codec assigned
      if ( ! stream.codec_type ) {
        return logger.debug('A codec was not provided for stream ' + stream.index + ', skipping.');
      }

      // Attach input
      stream.input = 0;

      // Format by stream type
      switch ( stream.codec_type ) {
        
        case 'video':
          
          if ( stream.codec_name === 'hevc' && ! options.override ) {
            status = 'Already encoded in x265, Skipping.';
            break;
          }

          streams.video.push(stream);
        break;
        
        case 'audio':
          streams.audio.push(stream);
        break;
        
        case 'subtitle':
          streams.subtitle.push(stream);
        break;
        
        default:
          
          if ( stream.codec_name === 'unknown' ) {
            logger.debug('Codec stream with index ' + stream.index + ' will not be included because it has an unknown codec.');
            break;
          }
          
          streams.other.push(stream);
        break;
      }
    });

    // Error in assignments
    if ( status !== true ) {
      return reject(status);
    }

    // Exit without a video or audio stream
    if ( streams.video.length <= 0 || streams.audio.length <= 0 ) {
      return reject('No available video or audio stream, skipping.');
    }

    // Only take forward one video stream
    if ( streams.video.length >= 2 ) {
      streams.video = [streams.video[0]];
      logger.debug('More than one video stream found, only using the primary one.');
    }

    // Only take the first audio channel
    if ( options.audio.strip && streams.audio.length >= 2 ) {
      streams.audio = [streams.audio[0]];
      logger.debug('More than one audio stream found, only saving the primary one.');
    }

    return resolve({streams: streams});
  });
};