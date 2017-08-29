'use strict';

// Export class for use
module.exports = {

  // Create a task object for consumption in the queue
  create: require('./create'),

  // Loads an array of tasks from a file
  load: require('./load'),

  // Validate the incoming task schema
  validate: require('./validate'),

  // Specify file formats to use
  format: require('./format'),

  // List files to be handled during this task
  listing: require('./listing')
};
