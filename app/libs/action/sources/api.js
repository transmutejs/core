'use strict';

// Load our modules
const utils = __require('libs/utils'),
      logger = __require('libs/log'),
      settings = __require('libs/settings');

// Socket handler
module.exports = function(options) {

  // Check if the user wants to enable this
  if ( settings.server.enable !== true ) {
    return;
  }

  // Start the server
  let server = utils.server().api;

  // Test
  server.get('/hello/:name', (req, res, next) => {
    res.send('hello ' + req.params.name);
    return next();
  });

  // Current task
  server.get('/task/current', (req, res, next) => {
    this.actions.task.current().then((result) => {
      res.send({status: true, result: result});
      return next();
    }).catch((err) => {
      res.send(404, {status: false, errors: [err]});
      return next();
    });
  });

  // Queue items
  server.get('/queue', (req, res, next) => {
    this.actions.queue.listing(req.query).then((result) => {
      res.send({status: true, result: result});
      return next();
    }).catch((err) => {
      res.send(404, {status: false, errors: [err]});
      return next();
    });
  });

};
