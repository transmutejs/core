'use strict';

// Left pad a string to a given length
module.exports = function(n, width, c) {
  
  // Set a default fill character
  c = c || '0';

  // Ensure we have a string
  n = n.toString();

  // Return the original if it's longer than width, otherwise pad it out
  return n.length >= width ? n : new Array(width - n.length + 1).join(c) + n;
};
