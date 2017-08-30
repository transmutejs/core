'use strict';

// Load requirements
const path = require('path'),
      os = require('os');

module.exports = {
  type: 'input',
  name: 'platform',
  message: 'Current platform',
  default: os.platform(),
  when: () => {
    return false;
  }
};
