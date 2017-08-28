'use strict';

// Set the correct pixel depth for video
module.exports = function(command, file, options, metadata, details) {
  return new Promise((resolve, reject) => {

    // Variables
    let bitDepth = 8;

    // Check for original bitdepth
    if ( command.streams.video[0] !== undefined ) {

      const regex = /^yuv420p([0-9]{2})le$/gi;

      let m = regex.exec(command.streams.video[0].pix_fmt);
      bitDepth = ( m === null ? bitDepth : parseInt(m[1]) );
    }

    // Set video encoding profile
    if ( options.video.bitdepth === 12 ) {
      command.outputOptions('-pix_fmt', 'yuv420p12le');

    } else if ( options.video.bitdepth === 10 ) {    
      command.outputOptions('-pix_fmt', 'yuv420p10le');

    } else if ( options.video.bitdepth === 8 ) {    
      command.outputOptions('-pix_fmt', 'yuv420p');

    } else {

      // Set the pixel format
      switch ( bitDepth ) {
        case 16:
          command.outputOptions('-pix_fmt', 'yuv420p16le');
        break;
        case 14:
          command.outputOptions('-pix_fmt', 'yuv420p14le');
        break;
        case 12:
          command.outputOptions('-pix_fmt', 'yuv420p12le');
        break;
        case 10:
          command.outputOptions('-pix_fmt', 'yuv420p10le');
        break;
        default:
          command.outputOptions('-pix_fmt', 'yuv420p');
        break;
      }
    }

    return resolve();
  });
};