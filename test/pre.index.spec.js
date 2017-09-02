'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs'),
      os = require('os');

// Helpers to avoid a lot of directory traversing
global.__base = path.resolve(__dirname + '/../') + '/app/';
global.__require = function(name) { return require(__base + name); };

// Recursive removal of files/directory
function rimraf(dir_path) {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(function(entry) {
            var entry_path = path.join(dir_path, entry);
            if (fs.lstatSync(entry_path).isDirectory()) {
                rimraf(entry_path);
            } else {
                fs.unlinkSync(entry_path);
            }
        });
        fs.rmdirSync(dir_path);
    }
}

module.exports = function() {

  // Define the required files and directories
  let configDir = path.resolve('./config'),
      configFile = path.join(configDir, 'config.json'),
      settingsFile = path.join(configDir, 'settings.json'),
      tasksFile = path.join(configDir, 'tasks.json');

  // Start with a clean slate
  rimraf(configDir);

  // Create config directory if we don't have one
  if ( ! fs.existsSync(configDir) ) {
    fs.mkdirSync(configDir);
  }

  // Create a base config file if needed
  if ( ! fs.existsSync(configFile) ) {
    fs.writeFileSync(configFile, JSON.stringify({
      setup: true,
      directories: {
        config: configDir,
        settings: configDir
      }
    }, null, 4));
  }

  // Create a base settings file if needed
  if ( ! fs.existsSync(settingsFile) ) {

    let settings = {
      language: 'en',
      platform: {},
      server: {
        port: 3001,
        address: '0.0.0.0'
      },
      video: {
        formats: ['mkv', 'mp4', 'avi', 'flv', 'mov', 'wmv']
      }
    };
    
    // Add os specific settings
    settings.platform[os.platform()] = {
      root: '~/',
      temp: os.tmpdir() + ( os.platform() === 'win32' ? '\\' : '/' ),
      directories: {
        show: '/',
        movie: '/'
      }
    };

    // Write it out
    fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 4));
  }

  // Create a base tasks file if needed
  if ( ! fs.existsSync(tasksFile) ) {
    fs.writeFileSync(tasksFile,
      JSON.stringify(require(__base + 'libs/setup/data/tasks'), null, 4)
    );
  }

};