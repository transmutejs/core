'use strict';

// Load requirements
const clk = require('chalk'),
      chalk = new clk.constructor({level: 1, enabled: true});

// Formats a string with ANSI styling
module.exports = function(str) {

  // Variables
  const regex = /\{([a-z,]+)\:([\s\S]*?)\}/gmi;
  let m;

  // Check for a non-string
  if ( typeof str !== 'string' ) {
    return '';
  }

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
  return ( str.match(regex) !== null ? this.colorString(str) : str.replace(/\{([a-z,]+)\:/gi, '') );
};
