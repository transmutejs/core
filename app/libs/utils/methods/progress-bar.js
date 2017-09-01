'use strict';

// Load requirements
const progress = require('progress');

// Creates an instance of progress bar, pre styled
module.exports = function(format, total) {

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
