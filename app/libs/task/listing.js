'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs');

// Load modules
const format = __require('libs/task/format');

// Helper method to check a file or directory exists
function exists(file) {
  return fs.existsSync(file);
}

// Helper method to check for a file
function isFile(file) {
  return ( exists(file) ? fs.lstatSync(file).isFile() : false );
}

const listing = function(directory, seasons) {
  return new Promise((resolve, reject) => {

    // Variables
    let tasks = [],
        files = [],
        promises = [];

    // Reject without a directory
    if ( ! directory ) {
      return reject('No file or directory provided');
    }

    // Normalize the search directory
    directory = path.normalize(directory);

    // Single file
    if ( isFile(directory) ) {

      // Still ensure it matches a format we want
      if ( ! this.format.match(directory) ) {
        return reject('invalid format');
      }

      // Push to tasks and resolve
      tasks.push({season: false, files: [directory]});
      return resolve(tasks);
    }

    // Handle seasons
    if ( seasons !== undefined && Array.isArray(seasons) && seasons.length > 0 ) {

      // Loop through the supplied seasons
      seasons.forEach((season) => {

        // Clean up season
        season = season.toString().trim();

        // Format the season directory path
        let seasonSub = ( parseInt(season) > 0 ? 'Season ' + season : season ),
            seasonDir = path.normalize(path.join(directory + '/' + seasonSub));

        // Push into promise queue
        promises.push(listing(seasonDir, season));
      });

      // Handle the promise resolution
      return Promise.all(promises).then((data) => {
        return resolve(data.map((season) => { return season[0]; }));
      }).catch((err) => {
        return reject(err.message || err);
      });
    }

    // Invalid directory
    if ( ! exists(directory) ) {
      return reject('invalid directory "' + directory + '"');
    }

    // Directory listing
    fs.readdir(directory, (err, result) => {

      // Skip without files or an error
      if ( err !== null || result.length <= 0 ) {
        return resolve([{season: seasons || false, files: []}]);
      }
      
      // Loop the available files
      result.forEach((file) => {

        // Update file to include directory
        file = path.join(directory, file);

        // Check it's actually a file and in the format we want
        if ( isFile(file) && format.match(file) ) {
          files.push(file);
        }
      });

      // Push files into array and resolve
      tasks.push({season: seasons || false, files: files});
      return resolve(tasks);
    });
  });
};

module.exports = listing;
