'use strict';

// Helpers to avoid a lot of directory traversing
global.__base = __dirname + '/';
global.__require = function(name) { return require(__base + name); };

// Set locale globally
const i18n = require('./libs/locale');

// Ensure we're ready to go
require('./libs/setup').then(() => {

  // Run CLI, get arguments, and begin processing
  const options = require('./libs/cli').input();

  // Script entry point
  require('./libs/action').go(options);

// Catch any errors that bubble up
}).catch((err) => {
  require('./libs/log').error(err);
  process.exit(1);
});
