'use strict';

const languages = __require('libs/utils/data/language');

// Normalize language string
module.exports = function(lang) {

  if ( ! lang || typeof lang !== 'string' ) {
    return 'Unknown';
  }

  switch (lang.length) {
    case 2:
      return languages.alpha2Languages[lang] || "Unknown";
    case 3:
      return languages.alpha3Languages[lang] || "Unknown";
    default:
      return ( lang.charAt(0).toUpperCase() + lang.slice(1) );
  }
};
