'use strict';

// Load requirements
const path = require('path'),
      assign = require('deep-assign');

// Variables
let queueCache = [];

// Send back the function
module.exports = function(task, options) {
  return new Promise((resolve, reject) => {

    // Merge task specific options
    options = assign(options, task.options);

    // Sort directory
    let directory = path.absolute(path.join(options.base, task.directory));

    // Get the tasks to be processed and add them to listing
    this.listing(directory, task.seasons).then((files) => {
      files.listing.forEach(function(file, i) {

        // Skip if already in queue
        if ( queueCache.includes(file) ) {
          return false;
        }

        console.log(file);

      });
    }).catch((err) => {
      console.log(err);
    });

  });
};
