'use strict';

// Load requirements
const fs = require('fs'),
      path = require('path');

// Start Trackt client
const _t = new (require('trakt.tv'))({
  client_id: process.env.TRAKT_CLIENT_ID
});

module.exports = {

  authenticate: function() {
    return new Promise((resolve, reject) => {

      // Got a valid token
      this.token().then((token) => {
        return resolve(_t);

      // Otherwise we need to get one
      }).catch((err) => {

        // Lets get the user to authenticate
        _t.get_codes().then((poll) => {

          // Temp display of details
          console.log('Visit - ' + poll.verification_url);
          console.log('Code - ' + poll.user_code);

          // Wait for verification
          return _t.poll_access(poll);

        // User authed
        }).then((data) => {

          // Store details
          this.store(data);

          return resolve(_t);

        // Timed out or need to refresh
        }).catch((err) => {
          
          // Token expired, refresh it
          if ( err === 'Expired' ) {
            return this.refresh().then((data) => {
              
              this.store(data);

              return resolve(_t);

            }).catch((err) => {
              return reject(err);
            });
          }

          return reject(err);
        });

      });

    });
  },

  refresh: function() {
    return _t.refresh_token();
  },

  revoke: function() {
    return _t.revoke_token();
  },

  store: function(data) {

    let file = path.resolve('./_trackt.json');

    let status = fs.writeFileSync(file, JSON.stringify(data, null, 4));

    console.log(status);
  },

  token: function() {
    return new Promise((resolve, reject) => {

      let file = path.resolve('./config/_trackt.json');

      if ( ! fs.existsSync(file) ) {
        return reject('no stored token');
      }

      _t.import_token(require(file)).then((token) => {
        return resolve(token);
      }).catch((err) => {
        return reject(err);
      });
    });
  }

};
