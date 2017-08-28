'use strict';

// Load requirements
const ffmpeg = require('fluent-ffmpeg');

// Configures the conversion task
module.exports = {

  config: function(file, options, metadata, error) {

    // Create an instance of ffmpeg
    let command = ffmpeg(file)
                    .renice(10)                          // Lower the cpu priorty for encode tasks
                    .outputOptions('-map_metadata', '0') // Keep metadata, title, cover image, etc.
                    .outputOptions('-map_chapters', '0') // Keep chapter data intact
                    .outputOptions('-hide_banner');      // Stops ffmpeg diagnostic output

    return command;
  }

};
