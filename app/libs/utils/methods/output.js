'use strict';

// Clear screen and output a message with title
module.exports = function(title, msg, step, total) {

  // Variables
  let titleStr = '';

  // Build title string
  if ( step !== undefined && total !== undefined ) {
    titleStr += this.colorString(lang('setup.ui.progress') + '\n', step, total, title);
  } else {
    titleStr += this.colorString(lang('setup.ui.standard') + '\n', title);
  }

  // Output
  process.stdout.write('\x1Bc');
  console.log(this.colorString('{bold:%s}', titleStr));
  console.log(this.colorString(msg) + '\n');
};
