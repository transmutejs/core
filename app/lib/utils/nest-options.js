'use strict';

module.exports = function(options, char) {

  // Variables
  char = char || ':';

  // Check for a non-object
  if ( typeof options !== 'object' ) {
    return {};
  }

  // Create object from options
  let formatted = Object.keys(options).reduce((clone, key) => {

    // Skip any underscore prefixed elements
    if ( key.substr(0, 1) === '_' ) {
      delete options[key];
      return clone;
    }

    // Split and reduce into sub-objects by the selected character
    key.split(char).reduce((iobj, ikey, i, arr) => {
      
      // Skip without an object parent
      if ( typeof iobj !== 'object' ) {
        return iobj;
      }

      // Assign value or create object
      iobj[ikey] = ( ( i + 1 === arr.length) ? options[key] : iobj[ikey] || {} );
      return iobj[ikey];
    }, clone);

    return clone;
  }, {});

  // Send it back
  return formatted;
};
