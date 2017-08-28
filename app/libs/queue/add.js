'use strict';

// Load requirements
const assign = require('deep-assign');

// Load libraries
const logger = require('../log');

// Variables
let queueCache = [];

// Send back the function
module.exports = function(task) {
  return new Promise((resolve, reject) => {

    // Variables
    let added = [],
        promises = [],
        options = {};

    // Exit without a task
    if ( ! task || typeof task !== 'object' ) {
      return reject('Missing or invalid task argument');
    }

    // Loop through and assign the available jobs to the queue
    task.jobs.forEach((job) => {

      // Skip if already in queue
      if ( queueCache.includes(job.file) ) {
        return false;
      }

      // Add to cache to stop additional runs
      queueCache.push(job.file);
      this.total = queueCache.length;
      
      // Track files being added with this task
      added.push(job.basename);

      // Merge options for this task
      job.options = assign(options, job.options);

      // Add to the queue
      promises.push(this.items.add(() => {

        // Update current task position
        this.current++;

        // Update overall counter
        task.overall = {total: this.total, current: this.current};

        // DEBUG
        logger.info('Starting task {green:%s} of {cyan:%s}', this.current, this.total);

        // Send to conversion for processing
        return require('../conversion').run(job);
      }));

    });

    // DEBUG
    console.log('Added:\n  ' + added.join('  \n').trim());

    // Unpause the queue
    this.items.maxPendingPromises = 1;
    this.items._dequeue();

    // Wait for this task to complete to resolve
    Promise.all(promises).then((result) => {
      return resolve(result);
    }).catch((err) => {
      console.log(err);
      return reject(err);
    });
  });
};
