'use strict';

// Load our modules
const utils = __require('libs/utils'),
      logger = __require('libs/log'),
      queue = __require('libs/queue');

// Variables
let limit = 10,
    offset = 0,
    hardLimit = 25;

// Get a list of the upcoming queue items
module.exports = function(params) {
  return new Promise((resolve, reject) => {

    // Is there anything in the queue
    if ( queue.length <= 0 ) {
      return reject('Queue is currently empty');
    }

    // Limit to our acceptable min and max
    params.limit = ( params.limit > hardLimit ? hardLimit : ( params.limit <= 0 ? 1 : params.limit ) );
    params.offset = ( params.offset <= 0 ? 0 : ( queue.length - params.offset - params.limit ) <= 0 ? queue.length - params.limit : params.offset );

    // Ensure defaults are set
    params.limit = parseInt(params.limit) || limit;
    params.offset = parseInt(params.offset) || offset;

    // Filter the queue items down
    let result = queue.items.queue.filter((item, i) => {
      return ( i + 1 ) >= params.offset && ( i + 1 ) <= ( params.offset + params.limit ) ? true : false; 
    }).map((item) => {
      return item.job;
    });

    // Resolve with items
    return resolve(result);
  });
};
