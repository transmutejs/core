'use strict';

// Load settings
const settings = __require('libs/settings');

// Returns a socket, and that's it
if ( settings.server.enable === true ) {
  
  // Create the http server
  let http = require('http').createServer().listen(settings.server.port, settings.server.address);

  // Create socket handler and return it
  module.exports = require('socket.io').listen(http);

// Doesn't want to use it, mock it
} else {
  module.exports = {
  	emit: function() { return true; }
  };
}
