'use strict';

// Load our modules
const utils = __require('libs/utils'),
      logger = __require('libs/log');

// Configures the conversion task
module.exports = {

  // Hand options off to actions and let them do their thing
  go: function(options) {
    utils.getMethods(this.sources).forEach((method) => {
      logger.verbose('Starting up ' + method);
      return this.sources[method](options);
    });
  },

  // Incoming data sources
  sources: {

    // General task file handler
    tasks: require('./sources/tasks'),

    // Watch the task file for updates
    watchTask: require('./sources/watch-task'),

    // Watch a directory for file changes
    watchDirectory: require('./sources/watch-directory'),

    // Socket connections
    socket: require('./sources/socket')
  },

  // Actions to perform
  actions: {

    // Creates a task object and returns the job list
    createTask: require('./actions/create-task')
  }

};
