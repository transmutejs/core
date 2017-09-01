'use strict';

// Load our modules
const utils = __require('libs/utils'),
      logger = __require('libs/log'),
      conversion = __require('libs/conversion');

// Configures the conversion task
module.exports = function(data, options) {
  return new Promise((resolve, reject) => {

    if ( conversion.current === null ) {
      return reject('No current job');
    }

    return resolve(conversion.current);
  });
};
