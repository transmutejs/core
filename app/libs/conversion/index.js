'use strict';

// Load requirements
const moment = require('moment'),
      filesize = require('filesize'),
      path = require('path'),
      fs = require('fs');

// Load libraries
const engine = __require('libs/engine'),
      utils = __require('libs/utils'),
      logger = __require('libs/log');

// Export for use
module.exports = {

  // Helps avoid errors when engine quits without starting
  progressBar: {terminate: function() { return; }},

  // Track the time since conversion began
  started: moment(),

  // Current job
  current: null,

  // Configures and runs the conversion task
  run: function(job) {
    return new Promise((resolve, reject) => {

      // Check we got a file at all
      if ( ! job ) {
        return reject('No job data provided');
      }

      // Assign job to current task
      this.current = job;

      // Configure the conversion engine command
      engine.config(job.file, job.options, job.meta, job.details).then((command) => {

        // Check command isn't an error
        if ( typeof command === 'string' ) {
          logger.warn(command);
          return resolve(false);
        }

        // Add additional details
        job.output = path.resolve(command.output);
        job.temp = path.resolve(command.temp);
        job.framerate = utils.framerate(job.meta.streams[0].avg_frame_rate);
        job.started = this.started.format('MMMM Do YYYY, h:mm:ss a');
        job.size = {
          original: {
            raw: fs.statSync(job.file).size,
            formatted: filesize(fs.statSync(job.file).size)
          }
        };

        // Bind events
        ['start', 'filenames', 'progress', 'error', 'end'].forEach((e) => {
          return command.on(e, function() {
              
            // Format arguments to include details and metadata
            let args = Array.prototype.slice.call(arguments);
            args.push(job, job.meta, resolve, reject);
              
            // Call event callback with args
            this['on' + e].apply(this, args);
          }.bind(this));
        });

        // Start processing the job
        return command.run();

      // Error with engine
      }).catch((err) => {
        return reject(err);
      });
    });
  },

  onstart: require('./events/start'),

  onfilenames: require('./events/filenames'),

  onprogress: require('./events/progress'),

  onerror: require('./events/error'),

  onend: require('./events/end')

};
