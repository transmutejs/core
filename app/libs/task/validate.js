'use strict';

// Load requirements
const ajv = require('ajv')({allErrors: true});

// Load our schemas
ajv.addSchema(require('./schema/tasks.schema'), 'tasks');
ajv.addSchema(require('./schema/task.schema'), 'task');

// Build the module structure
module.exports = {

  // Error formatting
  error: function(errors) {
    return {
      status: false,
      errors: ( Array.isArray(errors) ? errors : [] ).map((err) => {
        return {path: err.dataPath || '', message: err.message || ''};
      })
    };
  },

  // Validate a single task object
  object: function(obj) {

    if ( ! ajv.validate('task', obj) ) {
      return this.error(ajv.errors);
    }

    return {status: true, errors: []};
  },

  // Validate a task config file
  file: function(obj) {

    if ( ! ajv.validate('tasks', obj) ) {
      return this.error(ajv.errors);
    }

    return {status: true, errors: []};
  }

};
