'use strict';

// Load requirements
const fs    = require('fs'),
      path  = require('path'),
      watch = require('node-watch');

// Load our modules
const logger = __require('libs/log'),
      task = __require('libs/task'),
      queue = __require('libs/queue'),
      settings = __require('libs/settings');

// General task file handling
module.exports = function(options) {

  // Does the user want to run this?
  if ( ! options.watch.config ) {
    return;
  }

  // Define the absolute path to task config
  let file = path.resolve(path.join(settings.directory, 'tasks.json'));

  // Setup watcher
  watch(file).on('change', function(event, filename) {

    // Only use the update event
    if ( event !== 'update' ) { return; }

    // Ensure the file exists
    if ( ! fs.existsSync(file) ) { return; }

    // Delete task cache, otherwise we won't see changes
    delete require.cache[file];

    // Load tasks from file
    task.load(file).then((tasks) => {

      // Check for tasks
      if ( ! tasks ) {
        return new Error('No tasks found');
      }

      // Variables
      let jobs = [];

      // Extract jobs from tasks
      tasks.forEach((t) => { t.jobs.forEach((j, i) => { jobs.push(j); }); });

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
  return logger.info('Listening for changes to task config.');
};
