'use strict';

// Load requirements
const assign = require('deep-assign');

// Load libraries
const logger = __require('libs/log');

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
      if ( this.cache.includes(job.file) ) {
        return false;
      }

      // Add to cache to stop additional runs
      this.cache.push(job.file);
      this.total = this.cache.length;
      
      // Track files being added with this task
      added.push(job.basename);

      // Merge options for this task
      job.options = assign(options, job.options);

      // Add to the queue
      promises.push(this.items.add(() => {

        // Update queue length
        this.length = ( this.items.getQueueLength() + this.items.getPendingLength() );

        // Update current task position
        this.current++;

        // Update overall counter
        task.overall = {total: this.total, current: this.current};

        // DEBUG
        logger.info('Starting task {cyan:%s} of {green:%s}', this.current, this.total);
        logger.debug('{magenta:%s}', job.basename);

        // Queue data test
        // Not needed, just keeping it for reference later
        /*if ( this.items.queue[0] ) {
          let next = this.items.queue[0].job;
          logger.info('Next task {green:' + next.basename + '}');
        }*/

        // Send to conversion for processing
        return __require('libs/conversion').run(job);
      }));

      // Add data to queue for lookup later
      if ( this.items.queue[( this.items.queue.length - 1)] ) {
        this.items.queue[( this.items.queue.length - 1)].job = job;
      }
    });

    // Additional items added
    if ( this.items.maxPendingPromises === 1 && added.length > 0 ) {
      console.log('');
      logger.info('Added:\n  {green:' + added.join('\n  ').trim() + '}');
    }

    // Unpause the queue
    this.items.maxPendingPromises = 1;
    this.items._dequeue();

    // Wait for this task to complete to resolve
    Promise.all(promises).then((result) => {
      return resolve(result);
    }).catch((err) => {
      return reject(err);
    });
  });
};
