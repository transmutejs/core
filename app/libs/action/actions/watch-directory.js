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
  let count = 0,
      directory = options.watch.directory;

  // Does the user want to run this?
  if ( ! directory ) {
    return;
  }

  // Define the absolute path to the directory
  if ( ! path.isAbsolute(directory) ) {
    directory = path.resolve(directory);
  }

  // Setup watcher
  watch(directory, {recursive: true}).on('change', function(event, filename) {

    // Create normalized path
    let file = path.normalize(path.join(directory, filename));

    // Ensure the file exists
    if ( ! fs.existsSync(file) ) { return; }

    // Create a new task
    task.create({
      name: 'Directory Watcher',
      directory: file,
      type: 'show', // Update with best guess
      seasons: [],
      options: options
    }).then((tasks) => {

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
  return logger.info('Listening for changes in "%s".', directory);
};
