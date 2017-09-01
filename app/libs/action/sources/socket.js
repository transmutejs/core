'use strict';

// Load our modules
const utils = __require('libs/utils'),
      logger = __require('libs/log'),
      task = __require('libs/task'),
      queue = __require('libs/queue'),
      settings = __require('libs/settings');

// Socket handler
module.exports = function(options) {

  // Check if the user wants to enable this
  if ( settings.server.enable !== true ) {
    return;
  }

  // Start the server
  let io = utils.server().socket;

};
