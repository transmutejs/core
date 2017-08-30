'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs');

// Load modules
const utils = require(__base + 'libs/utils');

module.exports = {
  type: 'input',
  name: 'root',
  message: 'Now, where is your root media directory?',
  when: () => {

    // War and peace!
    console.log(utils.colorString('\x1Bc{bold:Now for some directory preferences!}\n'));
    console.log(utils.colorString('I split directory paths into three parts - {green:root}, {magenta:show} and {red:movie}.\n'));
    console.log(utils.colorString('For example on Mac or Linux it could be:\n\n  {green:/volumes/media/}{magenta:TV Shows/}\n\nOr on a Windows network share:\n\n  {green:\\\\SERVER\\media\\}{red:Movies\\}\n'));
    console.log(utils.colorString('Don\'t worry though, while most tasks use these params you can just leave {magenta:show} or {red:movie} blank to use the same directory. You can also ignore these and setup tasks with absolute paths.\n'));

    return true;
  },
  validate: (val, answers) => {

    if ( ! val.match(/[/|\/]$/) ) {
      return 'Paths must end with a slash';
    }

    if ( ! path.isAbsolute(val) ) {
      return 'Root path must be absolute';
    }

    if ( ! fs.existsSync(val) || ! fs.lstatSync(val).isDirectory() ) {
      return 'Path either does not exist or is not a directory';
    }

    return true;
  }
};
