'use strict';

module.exports = function(length) {
  
  let str = [],
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for ( let i = 0; i < length; i = i + 1) {
    str.push(chars[getRandomInt(0, chars.length - 1)]);
  }

  return str.join('');
};
