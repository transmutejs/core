'use strict';

// Helper to avoid a lot of directory traversing
global.__base = __dirname + '/';

// Load requirements
const logger = require('./libs/log'),
      task = require('./libs/task'),
      queue = require('./libs/queue');

// Ensure we're ready to go
require('./libs/setup').oobe().then(() => {

  // Run CLI, get arguments, and begin processing
  const cli = require('./libs/cli'),
        options = cli.start().input();

  // Load tasks from file
  return task.load('tasks.json');

}).then((tasks) => {
    
  // Variables
  let jobs = [];

  // Extract jobs from tasks
  tasks.forEach((t) => { t.jobs.forEach((j, i) => { jobs.push(j); }); });

  // Add jobs into queue and convert
  return queue.add({jobs: jobs});

// Conversion queue complete
}).then((complete) => {
  logger.info('End of queue');
  process.exit(0);

// Catch any errors that bubble up
}).catch((err) => {
  logger.error(err);
  process.exit(1);
});
