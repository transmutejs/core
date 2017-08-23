'use strict';

// Load requirements
const winston = require('winston'),
      path = require('path'),
      utils = require('../utils'),
      fs = require('fs');

// Add rotation to winston logs
require('winston-daily-rotate-file');

// Get log directory
let dir = path.resolve('./' + ( process.env.LOG_DIR || 'logs' ));

// Ensure the directory exists
if ( ! fs.existsSync(dir) ) {
  fs.mkdirSync(dir);
}

// Setup the logger interfaces for console, file and exception handling
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: ( process.env.ENV === 'development' ? 'debug' : 'info' ),
      colorize: true
    }),
    new (winston.transports.DailyRotateFile)({
      filename: path.join(dir, process.env.ENV + '.'),
      datePattern: 'yyyy-MM-dd.log',
      level: ( process.env.ENV === 'development' ? 'debug' : 'warning' )
    })
  ],
  exceptionHandlers: [
    new (winston.transports.DailyRotateFile)({
      filename: path.join(dir, 'exceptions.'),
      datePattern: 'yyyy-MM-dd.log'
    })
  ]
});

// Add colorize support
logger.filters.push(function(level, msg, meta) {
  return utils.colorString(msg);
});

// Export for use
module.exports = logger;
