'use strict';

// Load our modules
const utils = __require('libs/utils'),
      logger = __require('libs/log'),
      queue = __require('libs/queue');

// Get the current in progress task
module.exports = function() {
  return new Promise((resolve, reject) => {

    // Variables
    let length = queue.items.queue.length;

    // Is there anything in the queue
    if ( queue.length <= 0 ) {
      return reject('Queue is currently empty');
    }

    // Clear and update queue
    queue.items.queue = queue.items.queue.filter((item, i) => {
      
      // Clear cache items, allowing them to be added again
      let index = queue.cache.indexOf(item.job.file);
      queue.cache.splice(index, 1);

      // Don't add to updated queue
      return false;
    });

    // Was it successful
    if ( queue.items.queue.length < length ) {

      // DEBUG
      console.log('');
      logger.info('Removed {red:%s} of {red:%s} items from queue.', ( length - queue.items.queue.length ), length);

      // Success
      return resolve(['Removed ' + ( length - queue.items.queue.length ) + ' of ' + length + ' items from queue']);
    }

    // Otherwise reject
    return reject('Failed to clear the queue');
  });
};
