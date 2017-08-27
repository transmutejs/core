'use strict';

// Load requirements
const parser = require('episode-parser');

// Send back the function
module.exports = function(trakt, filename) {
  return new Promise((resolve, reject) => {

    if ( filename === undefined ) {
      return reject('filename not defined');
    }

    // Decode episode details from filename
    let episode = parser(filename);
    console.log(episode);

    // Go find the show details if needed

        trakt.search.text({
          query: episode.show,
          type: 'show'
        }).then((response) => {
          
          console.log(response);

    	  return resolve(response);

    	}).catch((err) => {
    		return reject(err);
    	});
  });
};
