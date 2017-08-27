'use strict';

// Load requirements
const parser = require('parse-torrent-name');

// Create promise to resolve with dataset
module.exports = function(filename) {
  return new Promise((resolve, reject) => {

    // No file provided
    if ( filename === undefined ) {
      return reject('No filename provided');
    }

    // Start our movie details source
    let source = require('./movie/' + ( process.env.TMDB_KEY ? 'tmdb' : 'tvmaze' ));

    // Decode details from filename
    let details = parser(filename);

    // Get the movie details
    source.findMovie(details.title).then((movie) => {
      return resolve(movie);
    }).catch((err) => {
      return reject(err);
    });
  });
};
