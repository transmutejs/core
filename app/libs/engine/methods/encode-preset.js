'use strict';

// Set encode preset
module.exports = function(command, file, options, metadata, details) {
  return new Promise((resolve, reject) => {

    command.outputOptions('-preset', options.preset);

    return resolve();
  });
};
