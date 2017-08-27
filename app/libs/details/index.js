'use strict';

// Load requirements
const fs = require('fs'),
      path = require('path');

// Define the config directory
let configDir = path.resolve('./config');

// Create config directory if we don't have one
if ( ! fs.existsSync(configDir) ) {
  fs.mkdirSync(configDir);
}

module.exports = {

  get: function(task) {
    return new Promise((resolve, reject) => {

      // Check type
      if ( task.type === undefined || ! ['show', 'move'].includes(task.type) ) {
        return reject('Invalid job type "' + task.type + '" specified');
      }

      // Get metadata, auth with trakt and get media information
      this.metadata.get(task.file).then((meta) => {
        task.meta = meta;
        return this[task.type](task.basename);
      }).then((info) => {
        task.details = info;
        return resolve(task);
      }).catch((err) => {
        return reject(err);
      });
    });
  },

  metadata: require('./metadata'),

  show: require('./show'),

  movie: require('./movie')
};
