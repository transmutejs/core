'use strict';

// Load requirements
const _trakt = require('./trakt'),
      path = require('path');

module.exports = {

  get: function(file, type) {
    return new Promise((resolve, reject) => {

      // Variables
      let filename = path.basename(file),
          details = {};

      // Check type
      if ( type === undefined || ! ['show', 'move'].includes(type) ) {
        return reject('Invalid job type "' + type + '" specified');
      }

      // Get metadata, auth with trakt and get media information
      this.metadata.get(file).then((meta) => {
        details.meta = meta;
        return _trakt.authenticate();
      }).then((trakt) => {
        return this[type](trakt, filename);
      }).then((info) => {
        details.info = info;
        return resolve(details);
      }).catch((err) => {
        return reject(err);
      });
    });
  },

  metadata: require('./metadata'),

  show: require('./show'),

  movie: require('./movie')
};
