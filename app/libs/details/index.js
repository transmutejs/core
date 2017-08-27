'use strict';

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
        return this[task.type].get(task.basename);
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
