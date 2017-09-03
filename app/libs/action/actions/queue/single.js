'use strict';

// Load our modules
const utils = __require('libs/utils'),
      logger = __require('libs/log'),
      queue = __require('libs/queue');

// Get the current in progress task
module.exports = function(id) {
  return new Promise((resolve, reject) => {

    // Is there anything in the queue
    if ( queue.length <= 0 ) {
      return reject('Queue is currently empty');
    }

    // DEBUG
    id = queue.items.queue[0].job.id;

    // Filter the queue items down
    let result = queue.items.queue.filter((item, i) => {
      return ( item.job.id === id ? true : false ); 
    }).map((item) => {
      return item.job;
    });

    // Was anything found
    if ( result.length <= 0 ) {
      return reject('Queue item "' + id + '" was not found');
    }

    // Otherwise resolve with item
    return resolve(result);
  });
};
