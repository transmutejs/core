'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs');

// Helper to avoid a lot of directory traversing
global.__base = path.resolve(__dirname + '/../') + '/app/';

module.exports = function() {

  // Define the required files and directories
  let configDir = path.resolve('./config'),
      configFile = path.join(configDir, 'config.json'),
      settingsFile = path.join(configDir, 'settings.json');

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
    fs.writeFileSync(settingsFile,
      JSON.stringify(require(__base + 'libs/setup/data/settings'), null, 4)
    );
  }

};