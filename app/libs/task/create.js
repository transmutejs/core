'use strict';

// Load requirements
const details = require('../details'),
      path = require('path');

// Export promise for use
module.exports = function(task) {
  return new Promise((resolve, reject) => {

    // Did we recieve any data
    if ( ! task ) {
      return reject(['No data provided for this task']);
    }

    // Check the task data is compliant
    let valid = this.validate.object(task);

    // If not, throw exception
    if ( ! valid.status ) {
      return reject(valid.errors.map((err) => { return err.path + '\n  ' + err.message; }));
    }

    // Get a files listing
    this.listing(task.directory).then((files) => {

      // Variables
      let promises = [],
          current = 1,
          overall = files.reduce(function(value, group) { return group.files.length; }, 0);

      // Get additional details for each task
      files.forEach((group) => {
        group.files.forEach(function(file, i) {
          
          promises.push(details.get({
            file: file,
            path: path.dirname(file),
            basename: path.basename(file),
            type: task.type,
            task: {
              current: ( i + 1 ),
              total: group.files.length
            },
            overall: {
              current: current,
              total: overall
            },
            options: task.options
          }));

          current++;
        });
      });

      // Wait for formatted job results
      return Promise.all(promises);

    }).then((jobs) => {

      task.jobs = jobs;
      
      // Resolve with task object
      return resolve(task);

    // Otherwise reject with an error
    }).catch((err) => {
      return reject(err);
    });
  });
};
