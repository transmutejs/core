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

// Package info
const pkg = require(path.resolve(path.join(__base, '../package')));

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
        message: lang('setup.index.continue'),
        when: () => {
          utils.output(lang('setup.index.welcome', pkg.version), lang('setup.index.first_run'));
          return true;
        }
      }]).then((answers) => {

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
        this.createSettings(answers);

        // Mark setup as complete
        config.setup = true;
        config.set({setup: config.setup});

        // Handle task file creation and validation
        return this.createTasks();

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

        // Variables
        let passed = 0, total = 2, tasks = {};

        // Output to the user
        utils.output(lang('setup.task.title'), lang('setup.task.message.confirm') + '\n\n' +
          lang('setup.task.message.created') + '\n\n' +
          lang('setup.task.message.todo')
        , 6, 6);

        // Delete task cache, otherwise we won't see changes
        delete require.cache[file];

        try {
          
          // Load task file
          tasks = require(file);
          total = ( 2 + tasks.tasks.length );

          // Valid json
          console.log(utils.colorString('  {green:\u2713} ' + lang('setup.task.validation.valid_json')));
          passed++;

        } catch(e) {
          console.log(utils.colorString('  {red:\u2717} ' + lang('setup.task.validation.invalid_json')));
        };

        // Perform checks
        let schema = validate.file(tasks);

        // Is it valid
        if ( schema.status === true ) {
          console.log(utils.colorString('  {green:\u2713} ' + lang('setup.task.validation.valid_schema')));
          passed++;
        } else {
          console.log(utils.colorString('  {red:\u2717} ' + lang('setup.task.validation.invalid_schema')));
          schema.errors.map((err) => { return console.log(utils.colorString('    {red:\u2717} ' + ( err.path ? err.path : 'root' ) + ':\n      ' + err.message)); });
        }

        // Check tasks for valid directories
        ( tasks.tasks ? tasks : {tasks: []} ).tasks.forEach((task, i) => {

          // Check for absolute path, if not create one
          if ( ! path.isAbsolute(task.directory) ) {
            let paths = settings.platform[os.platform()];
            task.directory = path.join(paths.root, paths.directories[task.type], task.directory);
          }

          // Get a job listing for the task
          require(__base + 'libs/task/listing')(task.directory, task.seasons).then((result) => {

            console.log(utils.colorString('  {green:\u2713} ' + lang('setup.task.task_no'), ( i + 1 )));
            
            result.forEach((season) => {
              if ( season.season !== false ) {
                console.log(utils.colorString('    {green:\u2713} ' + lang('setup.task.season_files'), season.season, season.files.length));
              } else {
                console.log(utils.colorString('    {green:\u2713} ' + lang('setup.task.found_files'), season.files.length));
              }
            });

            passed++;

            // All done?
            if ( passed >= total ) {
              return resolve();
            }

          }).catch((err) => {
            console.log(utils.colorString('  {red:\u2717} ' + lang('setup.task.task_no'), ( i + 1 )));
            console.log(utils.colorString('      {red:\u2717} %s', err));
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
