'use strict';

// Load our requirements
const path = require('path'),
      fs = require('fs'),
      tvmaze = require('tvmaze-node');

// Load libraries
const settings = __require('libs/settings'),
      cache = __require('libs/job/cache');

module.exports = function() {
  return {

    // Get show from cache or search tvmaze
    findShow: function(name) {
      return new Promise((resolve, reject) => {

        // Variables
        let show;

        // Missing required data
        if ( ! name ) {
          return reject('Invalid data provided');
        }

        // Try and get it from cache
        if ( ( show = cache.findShow(name) ) ) {
          return resolve(show);
        }

        // Nothing found, lets got get it
        tvmaze.singleShow(name, 'episodes', (err, res) => {
          
          // Something went wrong...
          if ( err !== null ) { return reject(err); }

          // Decode JSON data
          res = ( typeof res === 'string' ? JSON.parse(res) : /* istanbul ignore next */ res );

          // Show needs formatted
          let details = this.formatShow(res);
          
          // Save it out
          cache.save(name, details);
          
          // Resolve with data
          return resolve(details);
        });
      });
    },

    // Get episode details
    findEpisode: function(name, season, episode) {
      return new Promise((resolve, reject) => {

        // Variables
        let data;

        // Missing required data
        if ( ! name || ! season || ! episode ) {
          return reject('Invalid data provided');
        }

        // Try and get it from cache
        if ( ( data = cache.findEpisode(name, season, episode) ) ) {
          return resolve(data);
        }

        // Not found, try and get it
        this.findShow(name).then((show) => {
          tvmaze.showById(show.id, 'episodesbynumber', [season, episode], (err, res) => {
            
            // Something went wrong...
            if ( err !== null ) { return reject(err); }

            // Decode JSON data
            res = ( typeof res === 'string' ? JSON.parse(res) : /* istanbul ignore next */ res );

            // Formatted episode
            let details = this.formatEpisode(res, show);

            // Ensure we have an episodes object
            show.episodes = show.episodes || {};

            // Save it to cache
            let key = cache.episodeKey(season, episode);
            show.episodes[key] = details;
            cache.save(show.name, show);

            // Format
            delete show.episodes;
            details.show = show;

            // Resolve with episode details
            return resolve(details);
          });
        }).catch((err) => {
          return reject(err);
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
        description: ( episode.summary || '' ).replace(/(<([^>]+)>)/ig, ''),
        background: ( episode.image && episode.image !== null && episode.image.original ? episode.image.original : null )
      };
    },

    // Formats a show object into something more consistent
    // TODO: Validate incoming schema
    formatShow: function(show) {

      // Variables
      let episodes = {};

      // Build the formatted show object
      let formatted = {
        id: show.id,
        name: show.name,
        year: show.premiered.split('-')[0],
        rating: show.rating.average,
        genres: show.genres,
        language: show.language,
        description: ( show.summary || '' ).replace(/(<([^>]+)>)/ig, ''),
        poster: ( show.image && show.image !== null && show.image.original ? show.image.original : null ),
        background: ( show.image && show.image !== null && show.image.original ? show.image.original : null )
      };

      // Is there episode data to format
      if ( show._embedded && show._embedded.episodes ) {
        show._embedded.episodes.forEach((episode) => {
          let key = cache.episodeKey(episode.season, episode.number);
          episodes[key] = this.formatEpisode(episode, formatted);
        });

      // Do we already have them
      } else if ( show.episodes ) {
        episodes = show.episodes;
      }

      // Add episodes to formatted
      formatted.episodes = episodes;

      // We're done here
      return formatted;
    }
  };
};
