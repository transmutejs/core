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
        files = [];

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



    // Directory listing
    fs.readdir(directory, (err, result) => {

      // Was there a problem
      if ( err !== null ) {
        return reject(err);
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
      tasks.push({season: false , files: files});
      return resolve(tasks);
    });
  });
};
