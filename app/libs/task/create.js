'use strict';

// Load requirements
const assign = require('deep-assign'),
      path = require('path'),
      os = require('os');

// Load our libraries
const job = __require('libs/job'),
      utils = __require('libs/utils'),
      settings = __require('libs/settings'),
      cli = __require('libs/cli'),
      logger = __require('libs/log');

// Export promise for use
module.exports = function(task) {
  return new Promise((resolve, reject) => {

    // Variables
    let bar = {terminate: function() { return; }},
        errors = [],
        promises = [],
        current = 1,
        overall = 0,
        resolved = 0;

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

      // Update overall job count
      overall = files.reduce((value, group) => { return ( value + group.files.length ); }, 0);

      // Prepare to get additional information
      files.forEach((group) => {
        group.files.forEach((file, i) => {

          // Push to be handled next
          promises.push(() => {
            return job.build({
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
            });
          });

          // update current position
          current++;
        });
      });

      // Create the progress bar
      logger.info('Found {green:%s} jobs to process for {magenta:%s}.', overall, task.name);
      bar = utils.progressBar(lang('task.create.ui.progress'), overall);

      // Process job tasks in serial and wait for result array
      return promises.reduce((prev, next) => {
        return prev.then((result) => {
          bar.tick();
          return next().then(Array.prototype.concat.bind(result)).catch((err) => { errors.push(err); return result; });
        });
      }, Promise.resolve([]));

    }).then((jobs) => {

      // Assign the resolved items
      task.jobs = jobs;

      // Close progress bar
      bar.update(1);
      bar.terminate();

      // Error handling
      if ( errors.length > 0 ) {
        let str = '{red:Skipped %s file%s due to errors.}';
        logger.warn(str, errors.length, errors.length != 1 ? 's' : '');
      }
      
      // Resolve with task object
      return resolve(task);

    // Otherwise reject with an error
    }).catch((err) => {
      return reject(err);
    });
  });
};
