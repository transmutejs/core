'use strict';

// Simple promise based http request function based on:
// https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/
module.exports = function(url) {

  // return new pending promise
  return new Promise((resolve, reject) => {

    // reject without url
    if ( ! url ) {
      return reject('invalid url provided');
    }

    // select http or https module, depending on reqested url
    const lib = url.startsWith('https') ? require('https') : require('http');

    // Make the request
    const request = lib.get(url, (response) => {

      // handle http errors
      if ( response.statusCode < 200 || response.statusCode > 299 ) {
        reject('Failed to load page, status code: ' + response.statusCode);
      }

      // temporary data holder
      const body = [];

      // on every content chunk, push it to the data array
      response.on('data', (chunk) => { body.push(chunk); });

      // we are done, resolve promise with those joined chunks and JSON decoded if possible
      response.on('end', () => { 
        body = body.join('');
        try { body = JSON.parse(body); } catch(e) { /* nothing */ };
        return resolve(body);
      });
    });

    // handle connection errors of the request
    request.on('error', (err) => { reject(err); });
  });
};
