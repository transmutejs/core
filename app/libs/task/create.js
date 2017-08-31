'use strict';

// Load requirements
const assign = require('deep-assign'),
      path = require('path'),
      os = require('os');

// Load our libraries
const job = require(__base + 'libs/job'),
      settings = require(__base + 'libs/settings'),
      cli = require(__base + 'libs/cli');

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

    // Check for absolute path, if not create one
    if ( ! path.isAbsolute(task.directory) ) {
      let paths = settings.platform[os.platform()];
      task.directory = path.join(paths.root, paths.directories[task.type], task.directory);
    }

    // Combine default and task options
    task.options = assign(cli.options, task.options);

    // Get a files listing
    this.listing(task.directory, task.seasons).then((files) => {

      // Variables
      let promises = [],
          current = 1,
          overall = files.reduce(function(value, group) { return group.files.length; }, 0);

      // Get additional details for each task
      files.forEach((group) => {
        group.files.forEach(function(file, i) {
          
          promises.push(job.build({
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
