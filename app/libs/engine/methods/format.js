'use strict';

// Certain formats need to be mapped to their proper name
const formatMap = {
  mkv: 'matroska'
};

// Set output container format
module.exports = function(command, file, options, metadata, details) {
  return new Promise((resolve, reject) => {

    // Map name where necisscary
    let format = formatMap[options.format] || options.format;

    // Get a list of the available formats
    command.getAvailableFormats((err, formats) => {

      // Check we have this one and can encode it
      if ( ! formats[format] || ! formats[format].canMux ) {
        return reject('Format "' + format + '" is not available for output.');
      }

      // Assign output format
      command.format(format);

      return resolve();
    });
  });
};
