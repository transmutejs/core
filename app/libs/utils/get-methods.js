'use strict';

// List available class methods
module.exports = function(obj, ignore) {

  ignore = ignore || [];

  return Object.getOwnPropertyNames(obj).filter((property) => {
    return ( typeof obj[property] === 'function' && ! ignore.includes(property) );
  });
};
