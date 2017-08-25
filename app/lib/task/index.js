'use strict';

// Create the constructor
function Task(data) {

  this.data = data;

  let valid = this.validate.object(data);

  if ( ! valid.status ) {
    throw new Error(valid.errors.map((err) => { return err.path + '\n  ' + err.message; }));
  }
}

// Add validation handling
Task.prototype.validate = require('./validate.js');

// Export class for use
module.exports = Task;
