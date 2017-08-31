'use strict';

// Convert string to camelCase
module.exports = function(str) {

  if ( typeof str !== 'string' ) {
    return str;
  }

  return str.replace(/-([a-z0-9])/ig, function(all, letter) {
    return letter.toUpperCase();
  });
};
