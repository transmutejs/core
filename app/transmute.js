'use strict';

// Helper to avoid a lot of directory traversing
global.__base = __dirname + '/';

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
