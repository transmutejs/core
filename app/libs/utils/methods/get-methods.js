'use strict';

// List available class methods
module.exports = function(obj, ignore) {

  // Normalize ignore
  ignore = ( Array.isArray(ignore) ? ignore : ( ignore || [] ) );

  // No input given
  if ( typeof obj !== 'object' || Array.isArray(obj) ) {
    return [];
  }

  // Traverse properties and build an array of functions not ignored
  return Object.getOwnPropertyNames(obj).filter((property) => {
    return ( typeof obj[property] === 'function' && ! ignore.includes(property) );
  });
};
