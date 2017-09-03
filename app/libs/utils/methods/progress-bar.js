'use strict';

// Load requirements
const progress = require('progress');

// Creates an instance of progress bar, pre styled
module.exports = function(format, total) {

  // Set a format if we didn't get one
  format = format || '[{magenta::bar}] {green::percent} {cyan::etas}';

  // Set a total if we didn't get one
  total = total || 100;

  // Colorize the bar style and return a progress instance
  return new progress(this.colorString(format), {
    complete: '=',
    incomplete: ' ',
    head: '>',
    clear: true,
    renderThrottle: 0,
    width: 30,
    total: total 
  });
};
