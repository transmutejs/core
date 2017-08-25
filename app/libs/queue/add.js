'use strict';

// Variables
let queueCache = [];

// Send back the function
module.exports = function(task) {
  return new Promise((resolve, reject) => {

    // Exit without a task
    if ( ! task || typeof task !== 'function' ) {
      return reject('Missing or invalid task argument');
    }

    // Resolve for now
    return resolve();
  });
};
