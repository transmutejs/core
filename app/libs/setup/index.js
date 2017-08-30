'use strict';

// Load requirements
const inquirer = require('inquirer'),
      assign = require('deep-assign'),
      path = require('path'),
      fs = require('fs'),
      os = require('os');

// Load our modules
const utils = require(__base + 'libs/utils'),
      config = require('./config')();

// Setup the environment for usage
module.exports = new Promise((resolve, reject) => {

  // Skip if user has already completed setup
  if ( config.setup === true ) {
    return resolve();
  }

  // Confirm they want to continue
  inquirer.prompt([{
    type: 'confirm',
    name: 'continue',
    message: 'Would you like to be taken through setup?',
    when: () => {
      console.log('\x1BcLooks like the first time you\'re running transmute');
      return true;
    }
  }]).then((answers) => {

    // User doesn't want to do setup
    if ( answers.continue === false ) {
      return reject('Manual setup instructions available: X');
    }

    // Setup questions
    let questions = [    
      require('./steps/config-directory'), // Setup the users config directory location
      require('./steps/language'),         // Set a language preference
      require('./steps/platform'),         // Get the current OS without showing the user anything
      require('./steps/root'),             // Get the root path to media files
      require('./steps/show'),             // TV Shows directory
      require('./steps/movie'),            // Movie directory
      require('./steps/temp'),             // Temp directory to render to
      require('./steps/formats')           // Video formats to look for
    ];

    // Ask the user
    return inquirer.prompt(questions);

  }).then((answers) => {

    // Build the settings object
    let settings = {language: answers.language, platform: {}, server: {}, video: {formats: answers.formats}};
    settings.platform[os.platform()] = {root: answers.root, temp: answers.temp, directories: {show: answers.show, movie: answers.movie}};
    settings.server = {port: 3001, address: '0.0.0.0'};

    // Write the settings object
    fs.writeFileSync(
      path.join(config.directories.settings, 'settings.json'),
      JSON.stringify(settings, null, 4)
    );

    // Mark setup as complete
    config.setup = true;
    config.set({setup: config.setup});

    // Create an example task file
    fs.writeFileSync(
      path.join(config.directories.settings, 'tasks.json'),
      JSON.stringify(require('./data/tasks.json'), null, 4)
    );

    // Let the user know
    console.log('\x1BcI\'ve gone ahead and created you an example task file in your config directory.');
    console.log('I\'ll wait here for you to edit it and we can start processing the jobs for you!\n\n');
    console.log('Press enter to continue...');

    // Wait for them to continue
    require('child_process').spawnSync("read _ ", {shell: true, stdio: [0, 1, 2]});

    // Resolve back to main thread
    return resolve();

  }).catch((err) => {
    return reject(err);
  });

});
