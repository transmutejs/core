'use strict';

module.exports = function(length) {
  
  let str = [],
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  for ( let i = 0; i < length; i = i + 1) {
    str.push(chars[getRandomInt(0, chars.length - 1)]);
  }

  return str.join('');
};
