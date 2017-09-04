'use strict';

// Load requirements
const inquirer = require('inquirer'),
      assign = require('deep-assign'),
      path = require('path'),
      fs = require('fs'),
      os = require('os');

// Load our modules
const utils = __require('libs/utils'),
      update = __require('libs/update'),
      config = require('./config')();

// Package info
const pkg = require(path.resolve(path.join(__base, '../package')));

// Settings file
const settingsFile = path.join(config.directories.settings, 'settings.json');

// Setup the environment for usage
module.exports = new Promise((resolve, reject) => {

  // Variables
  let prereqs = Promise.resolve();

  // Ensure the correct components are available
  if ( ! utils.commandExists('ffmpeg') || ! utils.commandExists('ffprobe') ) {
    prereqs = require('./steps/prereqs')();
  }

  // Start with prerequisites
  prereqs.then(() => {

    // Check version and attempt to update
    return update.run();

  }).then(() => {

    // Try and load the settings file to check for OS specific config
    if ( fs.existsSync(settingsFile) ) {
      let settings = require(settingsFile);
      config.osSetup = ( settings.platform[os.platform()] ? true : false );
    }

    // Skip if user has already completed setup
    if ( config.setup === true /* && config.osSetup*/ ) {
      return resolve();
    }

    // Confirm they want to be guided
    return inquirer.prompt([{
      type: 'confirm',
      name: 'continue',
      message: lang('setup.index.continue'),
      when: () => {
        utils.output(lang('setup.index.welcome', pkg.version), lang('setup.index.first_run'));
        return true;
      }
    }]);

  }).then((answers) => {

    // User doesn't want to do setup
    if ( answers.continue === false ) {
      return reject(lang('setup.index.manual', pkg.homepage));
    }

    // Continue setup
    return inquirer.prompt([
      require('./steps/config-directory'), // Setup the users config directory location
      require('./steps/language'),         // Set a language preference
      require('./steps/platform'),         // Get the current OS without showing the user anything
      require('./steps/root'),             // Get the root path to media files
      require('./steps/show'),             // TV Shows directory
      require('./steps/movie'),            // Movie directory
      require('./steps/temp'),             // Temp directory to render to
      require('./steps/formats')           // Video formats to look for
    ]);

  }).then((answers) => {

    // Create the settings file
    require('./steps/create-settings')(answers);

    // Mark setup as complete
    config.setup = true;
    config.set({setup: config.setup});

    // Handle task file creation and validation
    return require('./steps/create-tasks')();

  }).then(() => {

    let count = 0, wait = 5, timer = setInterval(function() {

      utils.output(lang('setup.complete.title'),
        lang('setup.complete.message') + '\n\n' +
        lang('setup.complete.countdown', ( wait - count))
      );

      count++;

      if ( count > wait ) { clearInterval(timer); return resolve(); }
    }, 1000);

  }).catch((err) => {
    return reject(err);
  });
});
