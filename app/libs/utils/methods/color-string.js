'use strict';

// Load requirements
const clk = require('chalk'),
      chalk = new clk.constructor({level: 1, enabled: true});

// Formats a string with ANSI styling
module.exports = function(str) {

  // Variables
  const regex = /\{([a-z,]+)\:([\s\S]*?)\}/gmi;
  let m = null, args = Array.prototype.slice.call(arguments, 1);

  // Check for a non-string
  if ( typeof str !== 'string' ) {
    return '';
  }

  // Add basic sprintf-esque support
  args.forEach((arg) => {
    str = str.replace('%s', arg);
  });

  // Loop through matches
  while ( ( m = regex.exec(str) ) !== null ) {

    // Allow for multiple formatting options
    let split   = m[1].split(','),
        partial = m[2];

    // Wrap the replacement area
    for ( let i in split ) {
      if ( chalk[split[i]] !== undefined ) {
        partial = chalk[split[i]](partial);
      }
    }

    // Make the replacement in the original string
    str = str.replace(m[0], partial);
  }

  // Still matches to be made
  return ( str.match(regex) !== null ? this.colorString(str, args) : str.replace(/\{([a-z,]+)\:/gi, '') );
};
