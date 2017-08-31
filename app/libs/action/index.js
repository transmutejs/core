'use strict';

// Load requirements
const ffmpeg = require('fluent-ffmpeg'),
      path = require('path');

// Load our modules
const utils = require(__base + 'libs/utils'),
      logger = require(__base + 'libs/log');

// Configures the conversion task
module.exports = {

  // Hand options off to actions and let them do their thing
  go: function(options) {
    utils.getMethods(this, ['go']).forEach((method) => {
      return this[method](options);
    });
  },

  // General task file handler
  task: require('./actions/task')

};
