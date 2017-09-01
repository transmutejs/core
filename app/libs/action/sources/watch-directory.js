'use strict';

// Load requirements
const fs    = require('fs'),
      path  = require('path'),
      watch = require('node-watch');

// Load our modules
const logger = __require('libs/log'),
      queue = __require('libs/queue');      

// General task file handling
module.exports = function(options) {

  // Variables
  let directory = options.watch.directory;

  // Does the user want to run this?
  if ( ! directory ) { return; }

  // Define the absolute path to the directory
  if ( ! path.isAbsolute(directory) ) {
    directory = path.resolve(directory);
  }

  // Setup watcher
  watch(directory, {recursive: true}).on('change', function(event, filename) {

    // Only use the update event
    if ( event !== 'update' ) { return; }

    // Create a new task
    this.actions.task.create({file: filename}).then((jobs) => {

      // Add jobs into queue and convert
      return queue.add({jobs: jobs});

    // Conversion queue complete
    }).then((complete) => {
      logger.info('Completed available tasks');

    // Error handler
    }).catch((err) => {
      logger.error(err);
    });
  });

  // Let the user know
  return logger.info('Listening for changes in "%s".', directory);
};
