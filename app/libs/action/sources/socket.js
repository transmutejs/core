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

  // Client connected
  io.on('connection', (socket) => {

    // Blank line to avoid progress bar clash
    console.log('');

    // log it
    let clientIp = socket.request.connection.remoteAddress;
    logger.info('Socket connection from {magenta:%s}', clientIp);

    // Respond with current task
    this.actions.task.current().then((result) => {
      return socket.emit('task current', {status: true, result: result});
    }).catch((err) => {
      return socket.emit('task current', {status: false, errors: [err]});
    });
  });

};
