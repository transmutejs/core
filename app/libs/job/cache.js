'use strict';

// Load our requirements
const path = require('path'),
      fs = require('fs');

// Load libraries
const settings = __require('libs/settings'),
      utils = __require('libs/utils');

// Variables
const cacheDir = path.join(settings.directory, 'cache');

// Create the cache directory if it doesnt exist
/* istanbul ignore else */
if ( ! fs.existsSync(cacheDir) ) {
  fs.mkdirSync(cacheDir);
}

module.exports = {

  // Normalize a text string to avoid missed searches
  normalize: function(text) {

    // Ensure text is a string
    text = text || '';

    // Perform all the replacements
    return text.toString().toLowerCase().trim()
               .normalize('NFD')                   // separate accent from letter
               .replace(/[\u0300-\u036f]/g, '')    // remove all separated accents
               .replace(/\s+/g, '-')               // replace spaces with -
               .replace(/&/g, '-and-')             // replace & with 'and'
               .replace(/[^\w\-]+/g, '')           // remove all non-word chars
               .replace(/\-\-+/g, '-')             // replace multiple '-' with single '-'
               .replace(/^[_-\s]+|[_-\s]+$/g, ''); // trim left and right characters
  },

  // Builds an episode key
  episodeKey: function(season, episode) {

    // Ensure season and episode exist
    season = season || '0';
    episode = episode || '0';

    // Create a normalized key
    return 'S' + utils.pad(season.toString(), 2) + 'E' + utils.pad(episode.toString(), 2);
  },

  // Search for a show
  findShow: function(name) {

    // Build filename
    let file = path.join(cacheDir, this.normalize(name) + '.json');

    // Doesnt exist, stop there
    if ( ! fs.existsSync(file) ) {
      return false;
    }

    // Read the file
    let data = fs.readFileSync(file);

    // Attempt to decode it
    try {
      return JSON.parse(data);
    } catch(e) {
      return false;
    }
  },

  // Search for an episode within a show cache
  findEpisode: function(name, season, episode) {

    // Variables
    let data;

    // Firstly we need the show
    let show = this.findShow(name);

    // Show wasn't found, or has no episodes
    if ( ! show || ! show.episodes ) { 
      return false;
    }

    // No data found
    if ( ! ( data = show.episodes[this.episodeKey(season, episode)] ) ) {
      return false;
    }

    // Reassign data
    delete show.episodes;
    data.show = show;

    // All done
    return data;
  },

  // Store a cache file
  save: function(name, data) {

    // Build filename
    let file = path.join(cacheDir, this.normalize(name) + '.json');

    // Write it out
    return fs.writeFileSync(file, JSON.stringify(data, null, 4));
  }

};
