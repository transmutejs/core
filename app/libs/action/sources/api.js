'use strict';

// Load requirements
const assign = require('deep-assign');

// Load our modules
const utils = __require('libs/utils'),
      logger = __require('libs/log'),
      settings = __require('libs/settings'),
      queue = __require('libs/queue');

// Socket handler
module.exports = function(options) {

  // Check if the user wants to enable this
  if ( settings.server.enable !== true ) {
    return;
  }

  // Start the server
  let server = utils.server().api;

  // Queue listing
  server.get('/queue', (req, res, next) => {
    this.actions.queue.listing(req.query).then((result) => {
      res.send({status: true, result: result});
      return next();
    }).catch((err) => {
      res.send(404, {status: false, errors: [err]});
      return next();
    });
  });

  // Clear the queue
  server.del('/queue/clear', (req, res, next) => {
    this.actions.queue.clear().then((result) => {
      res.send({status: true, result: result});
      return next();
    }).catch((err) => {
      res.send(404, {status: false, errors: [err]});
      return next();
    });
  });

  // Delete queue item
  server.del('/queue/:id([a-z0-9]{16})', (req, res, next) => {
    this.actions.queue.delete(req.params.id).then((result) => {
      res.send({status: true, result: result});
      return next();
    }).catch((err) => {
      res.send(404, {status: false, errors: [err]});
      return next();
    });
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

  // Task creation
  server.post('/task', (req, res, next) => {
    this.actions.task.create(req.body, req.body.options || {}).then((jobs) => {
      res.send({status: true, result: jobs});
      next();
      return queue.add({jobs: jobs});
    }).then((result) => {
      /* Nothing */
    }).catch((err) => {
      res.send(407, {status: false, errors: [err]});
      return next();
    });
  });
};
