'use strict';

// Load requirements
const path = require('path'),
      assign = require('deep-assign');

// Variables
let queueCache = [];

// Send back the function
module.exports = function(task, options) {
  return new Promise((resolve, reject) => {

    // Exit without task or options
    if ( ! task || ! options ) {
      return reject('Missing param "' + ( ! task ? 'task' : 'options' ) + '"');
    }

    // TODO: Validate schemas

    // Merge for task specific options
    options = assign(options, task.options);

    // Create absolute directory path
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
