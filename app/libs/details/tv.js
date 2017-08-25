'use strict';

// Send back the function
module.exports = function(filename) {
  return new Promise((resolve, reject) => {

    if ( filename === undefined ) {
      return reject('filename not defined');
    }

    return resolve();
  });
};
