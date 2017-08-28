'use strict';

// Assign the video codec to use
module.exports = function(command, file, options, metadata, details) {
  return new Promise((resolve, reject) => {

    // Assign video codec
    command.videoCodec(options.video.codec);

    // Check for hardware acceleration
    // Detection not yet enabled
    if ( options.hwAccel ) {

      // Enable x264 or hevc transcoding for nvidia 10 series cards
      command.videoCodec(( /264/g.exec(options.video.codec) != null ? 'h264' : 'hevc' ) + '_nvenc');
    }

    return resolve();
  });
};
