'use strict';

// Load requirements
const details = require('../details');

// Export promise for use
module.exports = function(data) {
  return new Promise((resolve, reject) => {

    // Did we recieve any data
    if ( ! data ) {
      return reject(['No data provided for this task']);
    }

    // Check the task data is compliant
    let valid = this.validate.object(data);

    // If not, throw exception
    if ( ! valid.status ) {
      return reject(valid.errors.map((err) => { return err.path + '\n  ' + err.message; }));
    }

    // Create our object
    let task = {
      data: data,
      jobs: []
    };

    // Get a files listing
    this.listing(data.directory).then((files) => {

      // Variables
      let promises = [];

      // Assign files to task
      task.files = files;

      // Get metadata for each task
      files.forEach((group) => {
        group.files.forEach(function(file, i) {
          promises.push(details.get(file, data.type));
        });
      });

      // Wait for formatted job results
      return Promise.all(promises);

    }).then((jobs) => {

      task.jobs = jobs;

      console.log(jobs);
      
      // Resolve with task object
      return resolve(task);

    // Otherwise reject with an error
    }).catch((err) => {
      return reject(err);
    });
  });
};

/*let details = {
  name: task.name,
  file: file,
  path: path.dirname(file),
  filename: filename,
  type: task.type,
  show: details.show || task.name,
  season: details.season || files.season,
  episode: details.episode || i,
  task: {
    current: ( i + 1 ),
    total: files.listing.length
  },
  overall: {
    current: this.current,
    total: this.total
  },
  options: opts
};*/
