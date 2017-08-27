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

      // Start by getting metadata
      this.metadata.get(file).then((meta) => {

        // Assign metadata to our object
        details.meta = meta;

        console.log(metadata);

        // Authenticate with trakt before continuing
        return _trakt.authenticate();
      }).then((trakt) => {

        return this[type](trakt, filename);
      }).then((info) => {

        details.info = info;

        console.log(info);

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
