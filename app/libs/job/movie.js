'use strict';

// Load requirements
const parser = require('parse-torrent-name');

// Create promise to resolve with dataset
module.exports = function(filename) {
  return new Promise((resolve, reject) => {

    // Variables
    let source;

    // No file provided
    if ( filename === undefined ) {
      return reject('No filename provided');
    }

    // Decode episode details from filename
    let details = parser(filename);

    // Append type
    details.type = 'movie';

    // Check we have what we need to continue
    // TODO: Replace with better validation
    if ( ! details.title ) {
      return resolve({});
    }

    // Resolve with base details
    return resolve(details);

    // Check for tmdb key
    /*if ( process.env.TMDB_KEY ) {
      source = require('./movie/tmdb')(process.env.TMDB_KEY);
    } else {
      source = require('./movie/tvmaze')();
    }

    // Decode details from filename
    let details = parser(filename);

    // Get the movie details
    source.findMovie(details.title).then((movie) => {
      movie.type = 'movie';
      return resolve(movie);
    }).catch((err) => {
      return reject(err);
    });*/
  });
};
