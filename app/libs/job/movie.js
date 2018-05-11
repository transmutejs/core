'use strict';

// Load requirements
const parser = require('parse-torrent-name');

// Load libraries
const settings = __require('libs/settings');

// Create promise to resolve with dataset
module.exports = function(filename) {
  return new Promise((resolve, reject) => {

    // Variables
    let source;

    // No file provided
    if ( filename === undefined ) {
      return reject('No filename provided');
    }

    // Check for tmdb key
    /* istanbul ignore if */
    if ( process.env.TMDB_KEY) {
      source = require('./movie/tmdb')(process.env.TMDB_KEY);
    } else if ( settings.tmdb && settings.tmdb.key ) {
      source = require('./movie/tmdb')(settings.tmdb.key);
    }

    // Decode details from filename
    let details = parser(filename);

    // Check we have what we need to continue
    // TODO: Replace with better validation
    if ( ! details.title ) {
      return resolve({});
    }

    // Get the movie details
    source.findMovie(details.title).then((movie) => {
      movie.type = 'movie';
      return resolve(movie);
    }).catch((err) => {
      return reject(err);
    });
  });
};
