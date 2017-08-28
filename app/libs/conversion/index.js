'use strict';

// Load requirements
const engine = require('../engine');

// Configures and runs the conversion task
module.exports = {

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
        return command.on(e, () => {
            
          // Format arguments to include details and metadata
          let args = Array.prototype.slice.call(arguments);
          args.push(details, metadata);
            
          // Call event callback with args
          this['on' + e].apply(this, args);
        });
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
