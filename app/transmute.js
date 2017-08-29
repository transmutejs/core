'use strict';

// Load settings
const settings = require('./libs/settings');

// Run CLI and get arguments
const cli = require('./libs/cli'),
      options = cli.input();

// Load required files
const task = require('./libs/task'),
      queue = require('./libs/queue'),
      logger = require('./libs/log');

// Load tasks from file
task.load('./config/tasks.json').then((tasks) => {
  
  // Extract jobs from tasks
  let jobs = [];
  tasks.forEach((t) => { t.jobs.forEach((j, i) => { jobs.push(j); }); });

  // Add jobs into queue and convert
  return queue.add({jobs: jobs});

// Conversion queue complete
}).then((complete) => {
  logger.info('End of queue.');
  process.exit(0);

// Catch any errors that bubble up
}).catch((err) => {
  console.log(err);
  process.exit(1);
});
