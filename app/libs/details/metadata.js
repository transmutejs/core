'use strict';

// Load requirements
const ffmpeg = require('fluent-ffmpeg'),
      utils = require('../utils');

// Build the module structure
module.exports = {

  // Error formatting
  error: function(file, err) {
    file = file.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    let regex = new RegExp(file + ': (.+?)\n', 'gmi');
    let m = regex.exec(err);
    return ( m !== null ? m[1] : err );
  },

  get: function(file) {
    return new Promise((resolve, reject) => {

      // Get the metadata
      utils.metadata(file).then((data) => {
        return resolve(data);
      }).catch((err) => {
        return reject([this.error(file, err)]);
      });
    });
  }

};
