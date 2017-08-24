'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs');

// Helper method to check for a file
function isFile(file) {
  return fs.lstatSync(file).isFile();
}

module.exports = function(directory, seasons) {
  return new Promise((resolve, reject) => {

    // Variables
    let tasks = [],
        files = [],
        promises = [];

    // Normalize the search directory
    directory = path.normalize(directory);

    // Single file
    if ( isFile(directory) ) {

      // Still ensure it matches a format we want
      if ( this.format.match(directory) ) {
        tasks.push({season: false, files: [directory]});
      }

      return resolve(tasks);
    }

    // Handle seasons
    if ( seasons !== undefined && Array.isArray(seasons) ) {

      // Loop through the supplied seasons
      seasons.forEach((season) => {

        // Clean up season
        season = season.toString().trim();

        // Format the season directory path
        let seasonSub = ( parseInt(season) > 0 ? 'Season ' + season : season ),
            seasonDir = path.normalize(path.join(directory + '/' + seasonSub));

        // Push into promise queue
        promises.push(this.listing(seasonDir, season));
      });

      // Handle the promise resolution
      return Promise.all(promises).then((data) => {
        return resolve(data.map((season) => { return season[0]; }));
      }).catch((err) => {
        return reject(err.message || err);
      });
    }

    // Directory listing
    fs.readdir(directory, (err, result) => {

      // Was there a problem
      if ( err !== null ) {
        return reject(err.message);
      }
      
      // Loop the available files
      result.forEach((file) => {

        // Update file to include directory
        file = path.join(directory, file);

        // Check it's actually a file and in the format we want
        if ( isFile(file) && this.format.match(file) ) {
          files.push(file);
        }
      });

      // Push files into array and resolve
      tasks.push({season: seasons || false, files: files});
      return resolve(tasks);
    });
  });
};
