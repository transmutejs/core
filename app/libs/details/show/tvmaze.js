'use strict';

// Load our requirements
const path = require('path'),
      fs = require('fs');

module.exports = function() {

  // Setup tvmaze specific properties
  let tvmaze = require('tvmaze-node'),
      tvmazeConfig = path.resolve('./config/_tvmaze.json');

  // Does the config file exists
  if ( ! fs.existsSync(tvmazeConfig) ) {
    fs.writeFileSync(tvmazeConfig, JSON.stringify({show: {}, movie: {}}, null, 4));
  }

  return {

    // Get show from cache or search tvmaze
    findShow: function(name) {
      return new Promise((resolve, reject) => {

        let data = JSON.parse(fs.readFileSync(tvmazeConfig));

        if ( data.show[name] !== undefined ) {
          return resolve(data.show[name]);
        }

        tvmaze.search(name, (err, res) => {
          
          if ( err !== null ) {
            return reject(err);
          }

          res = ( typeof res === 'string' ? JSON.parse(res) : /* istanbul ignore next */ res );

          let details = this.formatShow(res[0].show);
          
          this.cacheShow(name, details);
          
          return resolve(details);
        });
      });
    },

    // Get episode details
    findEpisode: function(show, season, episode) {
      return new Promise((resolve, reject) => {

        if ( ! show || ! show.id ) {
          return reject('Invalid show provided');
        }

        tvmaze.showById(show.id, "episodesbynumber", [season, episode], (err, res) => {
          
          if ( err !== null ) {
            return reject(err);
          }

          res = ( typeof res === 'string' ? JSON.parse(res) : /* istanbul ignore next */  res );

          let details = this.formatEpisode(res, show);

          return resolve(details);
        });
      });
    },

    // Formats an episode object into something more consistent
    // TODO: Validate incoming schema
    formatEpisode: function(episode, show) {
      return {
        id: episode.id,
        season: episode.season,
        episode: episode.number,
        name: episode.name,
        date: episode.airdate,
        rating: show.rating, // episode rating not provided
        description: episode.summary.replace(/(<([^>]+)>)/ig, ''),
        background: episode.image.original,
        show: show
      };
    },

    // Formats a show object into something more consistent
    // TODO: Validate incoming schema
    formatShow: function(show) {
      return {
        id: show.id,
        name: show.name,
        year: show.premiered.split('-')[0],
        rating: show.rating.average,
        genres: show.genres,
        language: show.language,
        description: show.summary.replace(/(<([^>]+)>)/ig, ''),
        poster: show.image.original,
        background: show.image.original
      };
    },

    // Store show in cache to avoid getShow calls
    cacheShow: function(name, details) {
      let data = JSON.parse(fs.readFileSync(tvmazeConfig));
      data.show[name] = details;
      return fs.writeFileSync(tvmazeConfig, JSON.stringify(data, null, 4));
    }
  };
};
