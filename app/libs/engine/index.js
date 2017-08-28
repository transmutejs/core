'use strict';

// Load requirements
const ffmpeg = require('fluent-ffmpeg'),
      path = require('path');

// Configures the conversion task
module.exports = {

  config: function(file, options, metadata, details) {
    return new Promise((resolve, reject) => {

      // Combine defaults with options
      options = this.utils.assignDefaults(options);

      // Create an instance of ffmpeg
      let command = ffmpeg(file)
                      .renice(10)                          // Lower the cpu priorty for encode tasks
                      .outputOptions('-map_metadata', '0') // Keep metadata, title, cover image, etc.
                      .outputOptions('-map_chapters', '0') // Keep chapter data intact
                      .outputOptions('-hide_banner');      // Stops ffmpeg diagnostic output

      // Loop over the available methods and configure the command
      this.utils.getMethods(this).reduce((promise, method) => {
        
        // Chain the promises
        return promise.then((result) => {

          // If we got an object back, try to assign to command
          if ( typeof result === 'object' ) {
            Object.keys(result).forEach((key) => {
              if ( ! command.hasOwnProperty(key) ) { command[key] = result[key]; }
            });
          }

          // Start the next setup command
          return this[method](command, file, options, metadata, details);
        });

      // Resolve to conversion task with command
      }, Promise.resolve()).then((result) => {
        return resolve(command);

      // Reject on error
      }).catch((err) => {
        return reject(err);
      });
    });
  },

  utils: require('./utils'),

  outputPath: require('./methods/output-path'),

  videoBitrate: require('./methods/video-bitrate'),

  videoSize: require('./methods/video-size')

};
