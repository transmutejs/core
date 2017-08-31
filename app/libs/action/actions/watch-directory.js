'use strict';

// Load requirements
const fs    = require('fs'),
      path  = require('path'),
      watch = require('node-watch'),
      parser = require('parse-torrent-name');

// Load our modules
const logger = require(__base + 'libs/log'),
      task = require(__base + 'libs/task'),
      queue = require(__base + 'libs/queue'),
      settings = require(__base + 'libs/settings'),
      format = require(__base + 'libs/task/format'),
      conversion = require(__base + 'libs/conversion');

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

    // Only use the update event
    if ( event !== 'update' ) { return; }

    // Create normalized path
    let file = path.normalize(filename);

    // Ensure the file exists
    if ( ! fs.existsSync(file) ) { return; }

    // Check it's in a format the user wants
    if ( ! format.match(file) ) { return; }

    // Ignore if this is our current render target
    if ( file === conversion.output || file === conversion.temp ) { return; }

    // Parse out the details if we can
    let details = parser(path.basename(file));

    // Create a new task
    task.create({
      name: path.basename(file),
      directory: file,
      type: ( details.season && details.episode ? 'show' : 'movie' ),
      seasons: [],
      options: options
    }).then((tasks) => {

      // Variables
      let jobs = [];

      // Extract jobs from tasks
      ( Array.isArray(tasks) ? tasks : [tasks] ).forEach((t) => {
        t.jobs.forEach((j, i) => { jobs.push(j); });
      });

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
