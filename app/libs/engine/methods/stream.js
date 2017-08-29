'use strict';

// Allow output streaming during conversion
module.exports = function(command, file, options, metadata, details) {
  return new Promise((resolve, reject) => {

    // Create streaming url
    let url = 'rtmp://127.0.0.1:3002/live/transmute';// live=1';

    // Add streaming
    command.output(url);
    
    return resolve({streamUrl: url});
  });
};
