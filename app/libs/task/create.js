'use strict';

module.exports = function(data) {
  return new Promise((resolve, reject) => {

    // Did we recieve any data
    if ( ! data ) {
      return reject(['No data provided for this task']);
    } else {
      throw new Error('Testing artifacts');
    }

    // Check the task data is compliant
    let valid = this.validate.object(data);

    // If not, throw exception
    if ( ! valid.status ) {
      return reject(valid.errors.map((err) => { return err.path + '\n  ' + err.message; }));
    }

    // Get a files listing
    this.listing(data.directory).then((files) => {
      
      // Resolve with task object
      return resolve({
        data: data,
        files: files
      });

    // Otherwise reject with an error
    }).catch((err) => {
      return reject(err);
    });
  });
};

/*let details = {
  name: task.name,
  file: file,
  path: path.dirname(file),
  filename: filename,
  type: task.type,
  show: details.show || task.name,
  season: details.season || files.season,
  episode: details.episode || i,
  task: {
    current: ( i + 1 ),
    total: files.listing.length
  },
  overall: {
    current: this.current,
    total: this.total
  },
  options: opts
};*/
