'use strict';

// Load requirements
const restify = require('restify'),
      path = require('path');

// Load libraries
const logger = __require('libs/log'),
      settings = __require('libs/settings');

// Get package information
const pkg = require(path.resolve(path.join(__base, '../package')));

// Variables
let server = null,
    socket = null;

// Export the returned object
module.exports = function() {

  // Check if the user wants to enable this
  if ( settings.server.enable !== true ) {
    return {};
  }

  // Does it need to be setup?
  if ( server === null ) {

    // Create the http server
    server = restify.createServer({
      name: pkg.name + ' (' + pkg.version + ')'
    });

    // Create the socket handler
    socket = require('socket.io').listen(server.server);

    // Start it up
    server.listen(settings.server.port, settings.server.address, () => {
      logger.info('%s listening at %s', server.name, server.url);
    });
  }

  // Create object and send it back
  return {
    api: server,
    socket: socket
  };

};
