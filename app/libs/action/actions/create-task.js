'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs'),
      parser = require('parse-torrent-name');

// Load our modules
const utils = __require('libs/utils'),
      logger = __require('libs/log'),
      task = __require('libs/task'),
      format = __require('libs/task/format'),
      conversion = __require('libs/conversion');

// Configures the conversion task
module.exports = function(data, options) {
  return new Promise((resolve, reject) => {

    // Check data object
    if ( ! data || ! data.file ) {
      return reject(lang('action.create.validation.invalid'));
    }

    // Variables
    let details = {season: undefined, episode: undefined},
        file = path.normalize(data.file),
        filename = path.basename(file),
        jobs = [];

    // Ensure the file exists
    if ( ! fs.existsSync(file) ) {
      return reject(lang('action.create.validation.no_file'));
    }

    // Check it's in a format the user wants
    if ( ! format.match(file) ) {
      return reject(lang('action.create.validation.format'));
    }

    // Ignore if this is our current render target
    if ( file === conversion.current.output || file === conversion.current.temp ) {
      return reject(lang('action.create.validation.output'));
    }

    // Create the task object
    let taskObject = {
      name: data.name || filename,
      directory: file,
      type: data.type || ( parser(filename).episode ? 'show' : 'movie' ),
      seasons: data.seasons || [],
      options: options || {}
    };

    // Create a new task
    task.create(taskObject).then((tasks) => {

      // Extract jobs from tasks
      ( Array.isArray(tasks) ? tasks : [tasks] ).forEach((t) => {
        t.jobs.forEach((j, i) => { jobs.push(j); });
      });

      // Resolve with jobs
      return resolve(jobs);

    }).catch((err) => {
      return reject(err);
    });
  });
};
