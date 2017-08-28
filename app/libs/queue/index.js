'use strict';

// Load requirements
const pq = require('promise-queue');

// Build the module structure
module.exports = {

  // Create paused queue instance
  items: new pq(0, Infinity),

  // Total number of items added to the queue
  total: 0,

  // Current number of items in the queue
  length: 0,

  // Current task number being run
  current: 0,

  // Add tasks to the queue
  add: require('./add')
};
