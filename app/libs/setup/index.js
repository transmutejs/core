'use strict';

// Load requirements
const inquirer = require('inquirer'),
      assign = require('deep-assign'),
      path = require('path'),
      fs = require('fs'),
      os = require('os'),
      watch = require('node-watch');

// Load our modules
const utils = require(__base + 'libs/utils'),
      config = require('./config')();

// Variables
let settings = {};

// Setup the environment for usage
module.exports = {

  oobe: function() {
    return new Promise((resolve, reject) => {

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
        this.createSettings(answers);

        // Mark setup as complete
        config.setup = true;
        // config.set({setup: config.setup});

        // Handle task file creation and validation
        return this.createTasks();

      }).then(() => {

        let count = 0,
            wait = 5;

        let timer = setInterval(function() {
          
          console.log('\x1Bc');
          console.log(utils.colorString('{bold:Awesome job!}\n'));
          console.log('You\'re all set to start trasmuting your media library (whooo!).\n');
          console.log('Starting in %s seconds...', ( wait - count ));

          count++;

          if ( count > wait ) {
            clearInterval(timer);
            return resolve();
          }
        }, 1000);

      }).catch((err) => {
        return reject(err);
      });
    });
  },

  createSettings: function(answers) {

    // Build the base settings object
    settings = {
      language: answers.language,
      platform: {},
      server: {
        port: 3001,
        address: '0.0.0.0'
      },
      video: {
        formats: answers.formats
      }
    };
    
    // Add os specific settings
    settings.platform[os.platform()] = {
      root: answers.root,
      temp: answers.temp,
      directories: {
        show: answers.show,
        movie: answers.movie
      }
    };

    // Write the settings object
    fs.writeFileSync(
      path.join(config.directories.settings, 'settings.json'),
      JSON.stringify(settings, null, 4)
    );
  },

  createTasks: function() {
    return new Promise((resolve, reject) => {

      // Variables
      let file = path.join(config.directories.settings, 'tasks.json'),
          validate = require(__base + 'libs/task/validate');

      // Create an example task file
      fs.writeFileSync(file, JSON.stringify(require('./data/tasks.json'), null, 4));

      // Setup watcher
      watch(file).on('change', function(event, filename) {

        // Start counting the passed checks
        let passed = 0,
            total = 1;
        
        // Let the user know
        console.log('\x1BcI\'ve gone ahead and created you an example task file in your config directory.');
        console.log('I\'ll wait here for you to edit it and we can start processing your first job!\n\n');

        // Delete task cache, otherwise we won't see changes
        delete require.cache[file];

        // Load task file
        let tasks = require(file);
        total = ( 1 + tasks.tasks.length );

        // Perform checks
        let schema = validate.file(tasks);

        // Is it valid
        if ( schema.status === true ) {
          console.log(utils.colorString('  {green:\u2713} Valid task config'));
          passed++;
        } else {
          console.log(utils.colorString('  {red:\u2717} Inalid task config'));
          console.log(schema.errors.map((err) => { return err.path + '\n  ' + err.message; }));
        }

        // Check tasks for valid directories
        tasks.tasks.forEach((task, i) => {

          // Check for absolute path, if not create one
          if ( ! path.isAbsolute(task.directory) ) {
            let paths = settings.platform[os.platform()];
            task.directory = path.join(paths.root, paths.directories[task.type], task.directory);
          }

          // Get a job listing for the task
          require(__base + 'libs/task/listing')(task.directory, task.seasons).then((result) => {

            console.log(utils.colorString('  {green:\u2713} Task %s -'), ( i + 1 ));
            
            result.forEach((season) => {
              console.log(utils.colorString('    {green:\u2713} %sound %s files'),
                ( season.season !== false ? 'Season ' + season.season + ' - f' : 'F' ),
                season.files.length);
            });

            passed++;

            // All done?
            if ( passed >= total ) {
              return resolve();
            }

          }).catch((err) => {
            console.log(utils.colorString('  {red:\u2717} Task %s -'), ( i + 1 ));
            console.log(utils.colorString('      {red:\u2717} %s'), err);
          });

        });

        // All done?
        if ( passed >= total ) {
          return resolve();
        }
      });

    });
  }

};
