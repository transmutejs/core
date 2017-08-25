'use strict';

// Load requirements
const ajv = require('ajv')({allErrors: true, removeAdditional: 'all'});

// Load our schemas
ajv.addSchema(require('./schema/tasks.schema'), 'tasks');
ajv.addSchema(require('./schema/task.schema'), 'task');

// Error formatting
function error(errors) {
  return {
    status: false,
    errors: errors.map((err) => {
      return {path: err.dataPath, message: err.message};
    })
  };
}

// Build the module structure
module.exports = {

  // Validate a single task object
  object: (obj) => {

    if ( ! ajv.validate('task', obj) ) {
      return error(ajv.errors);
    }

    return {status: true, errors: []};
  },

  // Validate a task config file
  file: (obj) => {

    if ( ! ajv.validate('tasks', obj) ) {
      return error(ajv.errors);
    }

    return {status: true, errors: []};
  }

};
