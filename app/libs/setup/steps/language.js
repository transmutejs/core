'use strict';

// Load requirements
const path = require('path');

module.exports = {
  type: 'list',
  name: 'language',
  message: 'Which language would you like to use?',
  choices: require(__base + 'libs/locale/available-locales')(path.resolve(__base + '../locales')),
  default: 'en',
  when: () => {
    console.log('\x1BcTime to set some preferences\n');
    return true;
  }
};
