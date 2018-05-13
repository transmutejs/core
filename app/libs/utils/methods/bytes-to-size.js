'use strict';

// Convert bytes to larger formats
module.exports = function(bytes, decimals, size) {
  if ( bytes == 0 ) { return '0 Bytes'; }

  let kilo = 1024;
  let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let places = decimals || 2;
  let i = Math.floor(Math.log(bytes) / Math.log(kilo));

  if ( size === true ) { return sizes[i]; }

  return parseFloat((bytes / Math.pow(kilo, i)).toFixed(places)) + ' ' + sizes[i];
};
