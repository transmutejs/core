'use strict';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Creates a pseudo random unique string of a given length
module.exports = function(length) {
  
  // Variables
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      str = [];

  // Handle string lengths
  length = parseInt(length) > 0 ? parseInt(length) : 10;
  
  // Limit to 32 characters
  length = length > 32 ? 32 : length;

  // Run length number loops and add a random character from chars arrray
  for ( let i = 0; i < length; i = i + 1) {
    str.push(chars[getRandomInt(0, chars.length - 1)]);
  }

  // Join array into string and return
  return str.join('');
};
