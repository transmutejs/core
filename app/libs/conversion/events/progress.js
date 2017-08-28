'use strict';

// On progress update
module.exports = function(progress, job, metadata) {

  // Update progress bar
  this.progressBar.update(( progress.percent / 100 ));
};
