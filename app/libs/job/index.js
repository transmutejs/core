'use strict';

// Load requirements
const assign = require('deep-assign');

// Load libraries
const utils = __require('libs/utils');

module.exports = {

  build: function(task) {
    return new Promise((resolve, reject) => {

      // Check for task
      // TODO: Replace with schema validation
      if ( ! task || ! task.file || ! task.type || ! task.basename ) {
        return reject('Invalid task object');
      }

      // Check type
      if ( ! task.type || ! ['show', 'movie'].includes(task.type) ) {
        return reject('Invalid job type "' + task.type + '" specified');
      }

      // Create a unique id and prepend it to task
      task = assign({id: utils.uid(16)}, task);

      // Decorate task with metadata and media information
      this.metadata.get(task).then((meta) => {
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

  movie: require('./movie'),

  cache: require('./cache')
};
