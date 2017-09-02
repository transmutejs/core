'use strict';

// Gets the framerate from an embedded math string
module.exports = function(rate) {

  // Can't deal with this as it is
  if ( typeof rate !== 'string' ) {
    return 0;
  }

  // Find if it's something we can work with
  let m = /([0-9\.]+).*?([\/+*-]).*?([0-9\.]+)/g.exec(rate);

  // Nope
  if ( m === null ) {
    return ( isNaN(rate) ? 0 : parseFloat(rate) );
  }

  // Do the thing
  switch(m[2]) {
    case '*':
      rate = parseFloat(m[1]) * parseFloat(m[3]);
      break;
    case '+':
      rate = parseFloat(m[1]) + parseFloat(m[3]);
      break;
    case '-':
      rate = parseFloat(m[1]) - parseFloat(m[3]);
      break;
    default:
      rate = parseFloat(m[1]) / parseFloat(m[3]);
      break;
  }

  return rate;
};
