'use strict';

// Load our requirements
const glob = require('glob'),
      path = require('path'),
      logger = require('../log');

// Build a list of the available locale files in a given directory
function availableLocales(dir) {

  // Variables
  let available = [];

  // Run through the installed locales and add to array to be loaded
  glob.sync(path.join(dir, '/*.json')).forEach((file) => {
    
    // Get the shortname for the file
    let lang = path.basename(file, '.json');

    // Add to our object
    logger.debug('Found the "%s" locale.', lang);  
    available.push(lang);
  });

  return available;
};

// Send it back
module.exports = availableLocales;
