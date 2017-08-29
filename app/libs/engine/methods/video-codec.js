'use strict';

// Assign the video codec to use
module.exports = function(command, file, options, metadata, details) {
  return new Promise((resolve, reject) => {

    // Check for hardware acceleration
    if ( options.hwAccel ) {
      
      // Enable x264 or hevc transcoding for nvidia 10 series cards
      options.video.codec = ( ( /264/g.exec(options.video.codec) != null ? 'h264' : 'hevc' ) + '_nvenc' );
    
    // Are we copying source?
    } else if ( options.video.codec === 'copy' ) {

      // Get the codec data from the video stream
      options.video.codec = command.streams.video[0].codec_name;
    }

    // Get a list of the available codecs
    command.getAvailableCodecs((err, codecs) => {

      // Check we have this one and can encode it
      if ( ! codecs[options.video.codec] || ! codecs[options.video.codec].canEncode ) {
        return reject('Codec "' + options.video.codec + '" is not available for encoding.');
      }

      // Assign video codec
      command.videoCodec(options.video.codec);

      return resolve();
    });
  });
};
