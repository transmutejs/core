'use strict';

// Load requirements
const parser = require('episode-parser');

// Create promise to resolve with dataset
module.exports = function(filename) {
  return new Promise((resolve, reject) => {

    // No file provided
    if ( filename === undefined ) {
      return reject('No filename provided');
    }

    // Start our show details source
    let source = require('./show/' + ( process.env.TMDB_KEY ? 'tmdb' : 'tvmaze' ));

    // Decode episode details from filename
    let details = parser(filename);

    // Check for the show in cache
    source.findShow(details.show).then((show) => {
      return source.findEpisode(show, details.season, details.episode);
    }).then((episode) => {
      return resolve(episode);
    }).catch((err) => {
      return reject(err);
    });
  });
};
