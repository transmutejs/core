'use strict';

const languages = require('./data/language');

// Normalize language string
module.exports = function(lang) {

  if ( typeof lang === 'undefined' ) {
    return 'Unknown';
  }

  switch (lang.length) {
    case 2:
      return languages.alpha2Languages[lang] || "Unknown";
    case 3:
      return languages.alpha3Languages[lang] || "Unknown";
    default:
      return ( lang.charAt(0).toUpperCase() + lang.slice(1) ) || "Unknown";
  }
};
