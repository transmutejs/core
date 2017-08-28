'use strict';

// Load requirements
const moment = require('moment'),
      filesize = require('filesize'),
      path = require('path'),
      fs = require('fs');

// Load libraries
const engine = require('../engine'),
      utils = require('../utils');

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

      // Add additional details
      job.output    = path.resolve('./sample.mp4'); // Temporary until engine is more advanced
      job.temp      = path.resolve('./sample.mp4'); // Temporary until engine is more advanced
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
