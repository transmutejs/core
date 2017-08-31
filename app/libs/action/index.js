'use strict';

// Load our modules
const utils = require(__base + 'libs/utils'),
      logger = require(__base + 'libs/log');

// Configures the conversion task
module.exports = {

  // Hand options off to actions and let them do their thing
  go: function(options) {
    utils.getMethods(this, ['go']).forEach((method) => {
      logger.verbose('Starting up ' + method);
      return this[method](options);
    });
  },

  // General task file handler
  task: require('./actions/task'),

  // Watch the task file for updates
  watchTask: require('./actions/watch-task'),

  // Watch a directory for file changes
  watchDirectory: require('./actions/watch-directory')

};
