'use strict';

// Load requirements
const utils = require('../utils');

// Build the module structure
module.exports = {

  // Error formatting
  error: function(err) {
    return ( Array.isArray(err) ? err : [err] ).map((str) => {
      let m = /\.[a-z0-9]{2,4}: (.+?)\n\s+at/gmi.exec(str);
      return ( m !== null ? m[1] : err );
    });
  },

  // Wrap the utils helper method to get metadata for a file
  get: function(file) {
    return new Promise((resolve, reject) => {

      // Get the metadata
      utils.metadata(file).then((data) => {
        return resolve(data);
      }).catch((err) => {
        return reject(this.error(err));
      });
    });
  }

};
