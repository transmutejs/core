'use strict';

// Load requirements
const fs    = require('fs'),
      path  = require('path'),
      watch = require('node-watch');

// Load our modules
const logger = require(__base + 'libs/log'),
      task = require(__base + 'libs/task'),
      queue = require(__base + 'libs/queue'),
      settings = require(__base + 'libs/settings');

// General task file handling
module.exports = function(options) {

  // Variables
  let count = 0;

  // Does the user want to run this?
  if ( ! options.watch.config ) {
    return;
  }

  // Define the absolute path to task config
  let file = path.resolve(path.join(settings.directory, 'tasks.json'));

  // Setup watcher
  watch(file).on('change', function(event, filename) {

    // Delete task cache, otherwise we won't see changes
    delete require.cache[file];

    // Load tasks from file
    task.load(file).then((tasks) => {

      // Variables
      let jobs = [];

      // Extract jobs from tasks
      tasks.forEach((t) => { t.jobs.forEach((j, i) => { jobs.push(j); }); });

      // Update count
      count = jobs.length;

      // Add jobs into queue and convert
      return queue.add({jobs: jobs});

    // Conversion queue complete
    }).then((complete) => {
      logger.info('Completed %s tasks', count);

    // Error handler
    }).catch((err) => {
      logger.error(err);
    });
  });

  // Let the user know
  return logger.info('Listening for changes to task config.');
};
