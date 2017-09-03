'use strict';

// Load our modules
const utils = __require('libs/utils'),
      logger = __require('libs/log');

// Configures the conversion task
module.exports = {

  // Hand options off to actions and let them do their thing
  go: function(options) {
    utils.getMethods(this, ['go']).forEach((method) => {
      
      // DEBUG
      logger.verbose('Starting input source {green:%s}', method);
      
      // Setup the input source
      return this[method](options);
    });
  },

  // General task file handler
  tasks: require('./sources/tasks'),

  // Watch the task file for updates
  watchTask: require('./sources/watch-task'),

  // Watch a directory for file changes
  watchDirectory: require('./sources/watch-directory'),

  // Socket connections
  socket: require('./sources/socket'),

  // API endpoints
  api: require('./sources/api'),

  // Actions to perform
  actions: {

    task: {

      // Creates a task object and returns the job list
      create: require('./actions/task/create'),

      // Return the current task in process
      current: require('./actions/task/current'),

    },

    queue: {

      // Get a list of the upcoming tasks
      listing: require('./actions/queue/listing'),

      // Remove a queue item
      delete: require('./actions/queue/delete'),

      // Removes all items from queue
      clear: require('./actions/queue/clear')

    }
  }

};
