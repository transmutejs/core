'use strict';

// Load requirements
const restify = require('restify'),
      path = require('path');

// Load libraries
const logger = __require('libs/log');

// Get package information
const pkg = require(path.resolve(path.join(__base, '../package')));

// Variables
let server = null,
    socket = null;

// Export the returned object
/* istanbul ignore next */
module.exports = function() {

  // Get settings
  const settings = __require('libs/settings');

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

    // Setup plugins
    server.use(restify.plugins.bodyParser());
    server.use(restify.plugins.queryParser({strictNullHandling: true}));
    server.use(restify.plugins.gzipResponse());

    // Create the socket handler
    socket = require('socket.io').listen(server.server);

    // Start it up
    server.listen(settings.server.port, settings.server.address, () => {
      logger.info(lang('utils.server.ready'), server.url);
    });
  }

  // Create object and send it back
  return {
    api: server,
    socket: socket
  };
};
