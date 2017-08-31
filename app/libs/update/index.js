'use strict';

// Load requirements
const path = require('path'),
      moment = require('moment'),
      inquirer = require('inquirer');

// Add duration timing to moment
require("moment-duration-format");

// Load our modules
const utils = __require('libs/utils'),
      update = __require('libs/update');

// Package info
const pkg = require(path.resolve(path.join(__base, '../package')));

module.exports = {

  run: function() {
    return new Promise((resolve, reject) => {

      // Disable until more testing has been done
      return resolve();
      
      // Get version information
      let latest = this.latestVersion(pkg.name); // jshint ignore:line

      // Skip if we're current
      if ( latest.behind === 0 ) {
        return resolve();
      }

      inquirer.prompt([{
        type: 'confirm',
        name: 'continue',
        message: lang('update.question'),
        when: () => {
          utils.output(lang('update.title'), lang('update.message', latest.behind, latest.version, latest.duration));
          return true;
        }
      }]).then((result) => {

        // Don't want to update and that's fine
        if ( result.continue === false ) {
          process.stdout.write('\x1Bc');
          return resolve();
        }

        // They want to update, lets take care of that
        return this.update(pkg.name, latest.version);

      }).then((result) => {
        utils.output('Complete', result);
        return resolve();

      }).catch((err) => {
        return reject(err);
      });
    });
  },

  update: function(name, version) {
    return new Promise((resolve, reject) => {

      // Build the command
      let cmd = 'npm install --silent --global ' + name;

      // Let them know it's in progress
      utils.output(lang('update.title'), lang('update.in_progress', version) + '\n');

      // Run the command
      require('child_process').exec(cmd, (err, stdout, stderr) => {

        // Check for errors
        if ( err !== null ) {
          return reject(err);
        }

        // Get the version info
        let latest = this.latestVersion(version);

        // Check the versions match
        if ( version !== latest.version ) {
          return reject(utils.colorString(lang('update.failed', version)));
        }

        // Otherwise, lets presume it was a success
        console.log(utils.colorString(lang('update.success', version)));
        console.log(lang('update.wait'));
        setTimeout(() => { return resolve(); }, 3000);
      });

    });
  },

  latestVersion: function(name) {

    // Variables
    let m, latest = {version: '', released: ''},
        releases = {},
        versions = [],
        version = pkg.version,
        regex = /'(.+?)': '([0-9]{4}-[0-9]{2}-[0-9]{2}.+?)'/gmi;

    // Ensure name is set
    name = name || pkg.name;

    // Get the package data from npm
    const output = require('child_process').execSync('npm info ' + name, {encoding: 'utf8'});

    // Decode versions into a usable object
    while ( ( m = regex.exec(output) ) !== null ) {
      
      // Stop infinite loops
      if ( m.index === regex.lastIndex ) { regex.lastIndex++; }
        
      // Push into all versions
      releases[m[1]] = moment(m[2]);
      versions.push(m[1]);

      // Update latest release
      latest.version = m[1];
      latest.released = versions[m[1]];
    }

    // Reverse into released at the top
    versions.reverse();

    // Calculate time since release
    let elapsed = moment.duration(releases[version].diff(moment()), 'milliseconds');

    // Prepare and return object
    return {
      current: version,
      version: versions[0],
      behind: versions.indexOf(version),
      duration: elapsed.abs().format(lang('update.elapsed'), {trim: 'left'})
    };
  }

};
