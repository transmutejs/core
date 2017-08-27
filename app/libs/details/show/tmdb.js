'use strict';

// Load our requirements
const path = require('path'),
      fs = require('fs');

// Setup TMDB specific properties
let tmdb = require('moviedb')(process.env.TMDB_KEY),
    tmdbConfig = path.resolve('./config/_tmdb.json'),
    tmdbImageUrl = 'https://image.tmdb.org/t/p/';

// Does the config file exists
if ( ! fs.existsSync(tmdbConfig) ) {
  fs.writeFileSync(tmdbConfig, JSON.stringify({show: {}, movie: {}}, null, 4));
}

module.exports = {

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
