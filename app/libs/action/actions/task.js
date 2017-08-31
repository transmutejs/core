'use strict';

// Load requirements
const ffmpeg = require('fluent-ffmpeg'),
      path = require('path');

// Load our modules
const utils = require(__base + 'libs/utils'),
      logger = require(__base + 'libs/log'),
      task = require(__base + 'libs/task'),
      queue = require(__base + 'libs/queue');

// General task file handling
module.exports = function(options) {

  // Variables
  let count = 0;

  // Load tasks from file
  task.load('tasks.json').then((tasks) => {
    
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
