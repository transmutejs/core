'use strict';

// Load our requirements
const path = require('path'),
      fs = require('fs');

// Ignored until keys are deployed onto travis to actually test this
/* istanbul ignore next */
module.exports = function(key) {

  // Setup TMDB specific properties
  let tmdb = require('moviedb')(key),
      tmdbConfig = path.resolve('./config/_tmdb.json'),
      tmdbImageUrl = 'https://image.tmdb.org/t/p/';

  // Does the config file exists
  if ( ! fs.existsSync(tmdbConfig) ) {
    fs.writeFileSync(tmdbConfig, JSON.stringify({show: {}, movie: {}}, null, 4));
  }

  // Create our object
  return {

    // Get movie from cache or search tmdb
    findMovie: function(name) {
      return new Promise((resolve, reject) => {
        let data = JSON.parse(fs.readFileSync(tmdbConfig));
        if ( data.movie[name] !== undefined ) { return resolve(data.movie[name]); }
        tmdb.searchMovie({query: name}, (err, res) => {
          if ( err !== null ) { return reject(err.message); }
          if ( res.results.length <= 0 ) { return resolve({}); }
          let details = this.formatMovie(res.results[0]);
          this.cacheMovie(name, details);
          return resolve(details);
        });
      });
    },

    // Formats a movie object into something more consistent
    formatMovie: function(movie) {
      return {
        id: movie.id,
        name: movie.title,
        year: movie.release_date.split('-')[0],
        rating: movie.vote_average,
        genres: movie.genre_ids,
        language: movie.original_language,
        description: movie.overview,
        poster: tmdbImageUrl + 'w780' + movie.poster_path,
        background: tmdbImageUrl + 'w1280' + movie.backdrop_path
      };
    },

    // Store show in cache to avoid getShow calls
    cacheMovie: function(name, details) {
      let data = JSON.parse(fs.readFileSync(tmdbConfig));
      data.movie[name] = details;
      return fs.writeFileSync(tmdbConfig, JSON.stringify(data, null, 4));
    }
  };
};
