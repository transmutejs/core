'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs');

// Load modules
const settings = __require('libs/settings'),
      job = __require('libs/job');

// Export promise for use
module.exports = function(file) {
  return new Promise((resolve, reject) => {

    // Variables
    let promises = [],
        tasks = [];

    // Resolve to an absolute path
    if ( ! path.isAbsolute(file) ) {
      file = path.resolve(path.join(settings.directory, file));
    }

    // Check the file exists
    if ( ! fs.existsSync(file) ) {
      return reject('Provided file "' + file + '" does not exist.');
    }

    // Load the file
    try {
      tasks = require(file);
    } catch(e) {
      return reject('Invalid JSON data');
    }

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
