'use strict';

// Create the constructor
function Task(data) {

  // Assign global variables
  this.data  = {};
  this.files = [];

  // Did we get data yet?
  if ( data !== undefined ) {
    this.add(data);
  }
}

// Load data after initialization
Task.prototype.add = function(data) {

  // Check the task data is compliant
  let valid = this.validate.object(data);

  // If not, throw exception
  if ( ! valid.status ) {
    throw new Error(valid.errors.map((err) => { return err.path + '\n  ' + err.message; }));
  }

  // Assign globally
  this.data = data;

  // Allow chaining from here
  return this;
};

// Add validation handling
Task.prototype.validate = require('./validate');

// Add format specifiers
Task.prototype.format = require('./format');

// Add file listing for this task
Task.prototype.listing = require('./listing');

// Add build task to prepare data for consumption in the queue
Task.prototype.prepare = require('./prepare');

// Export class for use
module.exports = Task;
