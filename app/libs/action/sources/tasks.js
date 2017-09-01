'use strict';

// Load our modules
const logger = __require('libs/log'),
      task = __require('libs/task'),
      queue = __require('libs/queue');

// General task file handling
module.exports = function(options) {

  // Does the user want to run this?
  if ( options.no_task ) {
    return;
  }

  // Variables
  let count = 0;

  // Load tasks from file
  task.load('tasks.json').then((tasks) => {

    // Check for tasks
    if ( ! tasks ) {
      return new Error('No tasks found');
    }
    
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
};
