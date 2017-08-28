'use strict';

// Load requirements
const engine = require('../engine'),
      moment = require('moment');

// Export for use
module.exports = {

  // Helps avoid errors when engine quits without starting
  progressBar: {terminate: function() { }},

  // Track the time since conversion began
  started: moment(),

  // Configures and runs the conversion task
  run: function(job) {
    return new Promise((resolve, reject) => {

      // Check we got a file at all
      if ( ! job ) {
        return reject('No job data provided');
      }

      // Configure the conversion engine command
      let command = engine.config(job.file, job.options, job.meta, (err) => {
        return reject(err);
      });

      // Bind events
      ['start', 'filenames', 'progress', 'error', 'end'].forEach((e) => {
        return command.on(e, function() {
            
          // Format arguments to include details and metadata
          let args = Array.prototype.slice.call(arguments);
          args.push(job, job.meta);
            
          // Call event callback with args
          this['on' + e].apply(this, args);
        }.bind(this));
      });

      // Start processing the job
      return command.run();
    });
  },

  onstart: require('./events/start'),

  onfilenames: require('./events/filenames'),

  onprogress: require('./events/progress'),

  onerror: require('./events/error'),

  onend: require('./events/end')

};
