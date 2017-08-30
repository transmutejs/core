'use strict';

// Load requirements
const path = require('path'),
      os = require('os');

// Load modules
const utils = require(__base + 'libs/utils');

module.exports = {
  type: 'checkbox',
  name: 'formats',
  message: '\x1BcLast thing I promise!\n\nWhich video formats are you interested in converting?\n',
  choices: [
    {name: 'mkv', checked: true},
    {name: 'mp4', checked: true},
    {name: 'avi', checked: false},
    {name: 'mov', checked: false},
    {name: 'wmv', checked: false},
    {name: 'flv', checked: false}
  ],
  when: () => {
    return true;
  },
  validate: function (answer) {
    
    if ( answer.length < 1 ) {
      return 'You must choose at least one video format';
    }
    
    return true;
  }
};

// let ui = new inquirer.ui.BottomBar();
// ui.updateBottomBar('new bottom bar content');
