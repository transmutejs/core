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
      source = require('./show/tmdb')(process.env.TMDB_KEY);
    } else if ( settings.tmdb && settings.tmdb.key ) {
      source = require('./show/tmdb')(settings.tmdb.key);
    } else {
      source = require('./show/tvmaze')();
    }

    // Decode episode details from filename
    let details = parser(filename);

    // Check we have what we need to continue
    // TODO: Replace with better validation
    if ( ! details.title || ! details.season || ! details.episode ) {
      return resolve({});
    }

    // Check for the show in cache
    source.findShow(details.title).then((show) => {
      return source.findEpisode(details.title, details.season, details.episode);
    }).then((episode) => {
      episode.type = 'show';
      return resolve(episode);
    }).catch((err) => {
      return reject(err);
    });
  });
};
