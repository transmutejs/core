'use strict';

// Load requirements
const path = require('path'),
      moment = require('moment'),
      inquirer = require('inquirer'),
      stripAnsi = require('strip-ansi'),
      fs = require('fs'),
      mv = require('mv');

// Add duration timing to moment
require("moment-duration-format");

// Load our modules
const utils = __require('libs/utils');

// Package info
const pkg = require(path.resolve(path.join(__base, '../package')));

// Config paths
const configDir = path.resolve(path.join(__base, '../config')),
      tmpDir = path.join(require('os').tmpdir(), utils.uid(16));

module.exports = {

  run: function() {
    return new Promise((resolve, reject) => {
      
      // Get version information
      let latest = this.latestVersion(pkg.name);

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

      // Backup the config directory if there is one
      if ( fs.existsSync(configDir) ) {
        mv(configDir, tmpDir, {mkdirp: true}, (err) => {});
      }

      // Build the command
      let cmd = 'npm update --silent --global ' + name;

      // Let them know it's in progress
      utils.output(lang('update.title'), lang('update.in_progress', version) + '\n');

      // Run the command
      require('child_process').exec(cmd, (err, stdout, stderr) => {

        // Check for errors
        if ( err !== null ) {
          return reject(err);
        }

        // Move the config directory back
        if ( fs.existsSync(tmpDir) ) {
          mv(tmpDir, configDir, {mkdirp: true}, (err) => {});
        }

        // Get the version info
        let latest = this.latestVersion(name);

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
        regex = /^latest: (.+)[\n]+published (.+?) by/gmi;

    // Ensure name is set
    name = name || pkg.name;

    // Get the package data from npm
    let output = require('child_process').execSync('npm info ' + name, {encoding: 'utf8'});

    // Remove color formatting
    output = stripAnsi(output);

    // Decode versions into a usable object
    while ( ( m = regex.exec(output) ) !== null ) {
      
      // Stop infinite loops
      if ( m.index === regex.lastIndex ) { regex.lastIndex++; }
        
      // Push into all versions
      let diff = m[2].split(' ');
      releases[m[1]] = moment().subtract(diff[0], diff[1])
      versions.push(m[1]);

      // Update latest release
      latest.version = m[1];
      latest.released = versions[m[1]];
    }

    // Reverse into released at the top
    versions.reverse();

    // Calculate time since release
    let elapsed = moment.duration(releases[latest.version].diff(moment()), 'milliseconds');

    // Prepare and return object
    return {
      current: version,
      version: versions[0],
      behind: version !== versions[0] ? 1 : 0,
      duration: elapsed.abs().format(lang('update.elapsed'), {trim: 'left'})
    };
  }

};
