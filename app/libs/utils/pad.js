'use strict';

// Left pad a string to a given length
module.exports = function(n, width, c) {
  c = c || '0';
  n = n.toString();
  return n.length >= width ? n : new Array(width - n.length + 1).join(c) + n;
};
