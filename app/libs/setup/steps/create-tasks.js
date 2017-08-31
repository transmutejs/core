'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs'),
      os = require('os'),
      watch = require('node-watch');

// Load our modules
const utils = __require('libs/utils'),
      settings = __require('libs/settings'),
      config = require('../config')();

module.exports = function() {
  return new Promise((resolve, reject) => {

    // Variables
    let file = path.join(config.directories.settings, 'tasks.json'),
        validate = __require('libs/task/validate');

    // Create an example task file
    fs.writeFileSync(file, JSON.stringify(__require('libs/setup/data/tasks.json'), null, 4));

    // Setup watcher
    watch(file).on('change', function(event, filename) {

      // Variables
      let passed = 0, total = 2, tasks = {};

      // Output to the user
      utils.output(lang('setup.task.title'), lang('setup.task.message.confirm') + '\n\n' +
        lang('setup.task.message.created') + '\n\n' +
        lang('setup.task.message.todo'), 6, 6);

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
      }

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
        __require('libs/task/listing')(task.directory, task.seasons).then((result) => {

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
};