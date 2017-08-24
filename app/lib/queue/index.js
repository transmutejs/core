'use strict';

// Load requirements
const pq = require('promise-queue');

// Build the module structure
module.exports = {

  // Create paused queue instance
  items: new pq(0, Infinity),

  // Total number of items added to the queue
  total: 0,

  // Current task number being run
  current: 0,

  // Load our sub-modules
  format: require('./format'),
  listing: require('./listing'),
  add: require('./add')
};
