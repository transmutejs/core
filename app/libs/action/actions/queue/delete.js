'use strict';

// Load our modules
const utils = __require('libs/utils'),
      logger = __require('libs/log'),
      queue = __require('libs/queue');

// Get the current in progress task
module.exports = function(id) {
  return new Promise((resolve, reject) => {

    // Variables
    let key = -1,
        length = queue.items.queue.length;

    // Is there anything in the queue
    if ( queue.length <= 0 ) {
      return reject('Queue is currently empty');
    }

    // DEBUG
    id = queue.items.queue[0].job.id;

    // Find the index of the item
    queue.items.queue.forEach((item, i) => {
      if ( item.job.id === id ) { key = i; }
    });

    // Was anything found
    if ( key < 0 ) {
      return reject('Queue item "' + id + '" was not found');
    }

    // Attempt to delete it
    let result = queue.items.queue.splice(key, 1);

    // Was it successful
    if ( queue.items.queue.length < length ) {

      // Remove item from cache
      let index = queue.cache.indexOf(result[0].job.file);
      queue.cache.splice(index, 1);

      // DEBUG
      console.log('');
      logger.info('"{red:%s}" removed from queue.', result[0].job.basename);

      // Success
      return resolve(['Removed "' + result[0].job.basename + '" from queue.']);
    }

    // Otherwise reject
    return reject('Failed to remove "' + id + '" from queue');
  });
};
