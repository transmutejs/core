'use strict';

// Load requirements
const utils = __require('libs/utils');

// Build the module structure
module.exports = {

  // Error formatting
  error: function(err) {
    return ( Array.isArray(err) ? err : [err] ).map((value) => {
      let m = /\.[a-z0-9]{2,4}: (.+?)\n\s+at/gmi.exec(value.toString());
      return ( m !== null ? m[1] : value );
    });
  },

  // Wrap the utils helper method to get metadata for a file
  get: function(task) {
    return new Promise((resolve, reject) => {

      // Get the metadata
      utils.metadata(task.file).then((data) => {
        return resolve(data);
      }).catch((err) => {
        return reject(this.error(err));
      });
    });
  }

};
