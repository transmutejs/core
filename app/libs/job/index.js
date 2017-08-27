'use strict';

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
