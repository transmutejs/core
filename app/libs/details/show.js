'use strict';

// Load requirements
const parser = require('episode-parser'),
      path = require('path'),
      fs = require('fs');

// Define config file location
let tmdb = null,
    tmdbConfig = path.resolve('./config/_tmdb.json'),
    tmdbImageUrl = 'https://image.tmdb.org/t/p/';

// Does it exist
if ( ! fs.existsSync(tmdbConfig) ) {
  fs.writeFileSync(tmdbConfig, JSON.stringify({show: {}, movie: {}}, null, 4));
}

// Send back the function
module.exports = {

  // Create promise to resolve with dataset
  get: function(filename) {
    return new Promise((resolve, reject) => {

      // No api key, nothing we can do
      if ( ! process.env.TMDB_KEY ) {
        return resolve({});
      }

      // No file provided
      if ( filename === undefined ) {
        return reject('No filename provided');
      }

      // Start tmdb
      tmdb = require('moviedb')(process.env.TMDB_KEY);

      // Decode episode details from filename
      let details = parser(filename);

      // Check for the show in cache
      this.findShow(details.show).then((show) => {
        return this.findEpisode(show, details.season, details.episode);
      }).then((episode) => {
        return resolve(episode);
      }).catch((err) => {
        return reject(err);
      });

    });
  },

  // Get episode details
  findEpisode: function(show, season, episode) {
    return new Promise((resolve, reject) => {
      tmdb.tvEpisodeInfo({
        id: show.id,
        season_number: season,
        episode_number: episode
      }, (err, res) => {
        if ( err !== null ) { return reject(err.message); }
        let details = this.formatEpisode(res, show);
        return resolve(details);
      });
    });
  },

  // Formats an episode object into something more consistent
  formatEpisode: function(episode, show) {
    return {
      id: episode.id,
      season: episode.season_number,
      episode: episode.episode_number,
      name: episode.name,
      date: episode.air_date,
      rating: episode.vote_average,
      description: episode.overview,
      background: tmdbImageUrl + 'original' + episode.still_path,
      show: show
    };
  },

  // Get show from cache or search tmdb
  findShow: function(name) {
    return new Promise((resolve, reject) => {
      let data = JSON.parse(fs.readFileSync(tmdbConfig));
      if ( data.show[name] !== undefined ) { return resolve(data.show[name]); }
      tmdb.searchTv({query: name}, (err, res) => {
        if ( err !== null ) { return reject(err.message); }
        let details = this.formatShow(res.results[0]);
        this.cacheShow(name, details);
        return resolve(details);
      });
    });
  },

  // Formats a show object into something more consistent
  formatShow: function(show) {
    return {
      id: show.id,
      name: show.name,
      year: show.first_air_date.split('-')[0],
      rating: show.vote_average,
      genres: show.genre_ids,
      language: show.original_language,
      description: show.overview,
      poster: tmdbImageUrl + 'w780' + show.poster_path,
      background: tmdbImageUrl + 'w1280' + show.backdrop_path
    };
  },

  // Store show in cache to avoid getShow calls
  cacheShow: function(name, details) {
    let data = JSON.parse(fs.readFileSync(tmdbConfig));
    data.show[name] = details;
    return fs.writeFileSync(tmdbConfig, JSON.stringify(data, null, 4));
  }
};
