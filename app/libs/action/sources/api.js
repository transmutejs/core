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

  // Automatically register action endpoints
  Object.keys(this.actions).forEach((resource) => {
    utils.getMethods(this.actions[resource]).forEach((action) => {

      // Variables
      let method = 'get',
          uri = '/' + resource;

      // Detect method & update uri
      if ( action === 'create' ) { method = 'post'; }
      else if ( action === 'listing' ) { method = 'get'; }
      else { uri += '/' + action; }

      // Create the routing action
      server[method](uri, (req, res, next) => {
        this.actions[resource][action](req.query).then((result) => {
          res.send({status: true, result: result});
          return next();
        }).catch((err) => {
          res.send(404, {status: false, errors: [err]});
          return next();
        });
      });

    });
  });

};
