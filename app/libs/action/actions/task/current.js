'use strict';

// Load our modules
const utils = __require('libs/utils'),
      logger = __require('libs/log'),
      conversion = __require('libs/conversion');

// Get the current in progress task
module.exports = function() {
  return new Promise((resolve, reject) => {

    if ( conversion.current === null ) {
      return reject('No current job');
    }

    return resolve(conversion.current);
  });
};
