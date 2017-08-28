'use strict';

// Gets the framerate from an embedded math string
module.exports = function(rate) {

  let values = rate.split('/');

  return parseInt(values[0]) / parseInt(values[1]);
};
