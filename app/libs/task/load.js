'use strict';

// Load requirements
const job = require('../job'),
      path = require('path'),
      fs = require('fs');

// Export promise for use
module.exports = function(file) {
  return new Promise((resolve, reject) => {

    // Variables
    let promises = [];

    // Resolve to an absolute path
    file = path.resolve(file);

    // Check the file exists
    if ( ! fs.existsSync(file) ) {
      return reject('Provided file "' + file + '" does not exist.');
    }

    // Load the file
    let tasks = require(file);

    // Check the task data is compliant
    let valid = this.validate.file(tasks);

    // If not, throw exception
    if ( ! valid.status ) {
      return reject(valid.errors.map((err) => { return err.path + '\n  ' + err.message; }));
    }

    // Loop the available tasks and pass them to task creation
    tasks.tasks.forEach((task) => {
      promises.push(this.create(task));
    });

    // Resolve with all tasks
    Promise.all(promises).then((result) => {
      return resolve(result);
    }).catch((err) => {
      return reject(err);
    });
  });
};