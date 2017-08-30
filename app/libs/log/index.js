'use strict';

// Load requirements
const winston = require('winston'),
      path = require('path'),
      utils = require(__base + 'libs/utils'),
      fs = require('fs');

// Add rotation to winston logs
require('winston-daily-rotate-file');

// Get log directory
let logDirectory = path.resolve(path.join(__base, '../logs'));

// Ensure the directory exists
fs.mkdir(logDirectory, (err) => { return; });

// Setup the logger interfaces for console, file and exception handling
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: process.env.CONSOLE_LEVEL,
      colorize: true
    }),
    new (winston.transports.DailyRotateFile)({
      filename: path.join(logDirectory, process.env.ENV + '.'),
      datePattern: 'yyyy-MM-dd.log',
      level: process.env.LOG_LEVEL
    })
  ],
  exceptionHandlers: [
    new (winston.transports.DailyRotateFile)({
      filename: path.join(logDirectory, 'exceptions.'),
      datePattern: 'yyyy-MM-dd.log',
      humanReadableUnhandledException: true
    })
  ]
});

// Add colorize support
logger.filters.push((level, msg, meta) => {
  return utils.colorString(msg);
});

// Export for use
module.exports = logger;
