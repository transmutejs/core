'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs');

// Assign the output path
module.exports = function(command, file, options, metadata, details) {
  return new Promise((resolve, reject) => {

    // Create the default filename
    let filename = path.basename(file, path.extname(file)) + ( options.preview ? '-preview' : '' ) + '.' + options.format;

    // Update filename with pattern
    if ( options.pattern ) {
      filename = this.utils.buildName(options.pattern[details.type], file, options, metadata, details);
    }

    // Build directory path
    let directory = this.utils.buildDir(file, options.target);
    let target = path.join(directory, filename);

    // Build temp path
    let tempDir = ( ! path.isAbsolute(options.temp) ? path.resolve(options.temp) : options.temp );
    let temp = path.join(tempDir, filename);

    // Does it already exist
    if ( fs.existsSync(target) && ! options.overwrite ) {
      return resolve('"' + filename + '" already exists in target directory, set --overwrite to continue');
    }

    // Assign to command, use temp if available
    command.output(( temp !== target ? temp : target ));

    // Resolve with path
    return resolve({output: target, temp: temp});
  });
};
