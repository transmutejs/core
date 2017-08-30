'use strict';

// Load requirements
const inquirer = require('inquirer');

// Load our modules
const utils = require(__base + 'libs/utils'),
      config = require('./config')();

// Variables
const ffmpegHomepage = 'https://www.ffmpeg.org/download.html';

// Export for use
module.exports = function() {
  return new Promise((resolve, reject) => {

    // Open installation page
    inquirer.prompt([{
      type: 'confirm',
      name: 'ffmpeg',
      message: lang('setup.prereqs.question'),
      default: true,
      when: () => {
        utils.output(lang('setup.prereqs.title'), lang('setup.prereqs.message.initial'), 0, 6);
        return true;
      }
    }]).then((answers) => {

      // Don't want to continue
      if ( ! answers.ffmpeg ) {
        return reject(utils.colorString(lang('setup.prereqs.message.cancel'), ffmpegHomepage));
      }

      // Take them to the page
      return require('opn')(ffmpegHomepage, {wait: false});

    // Homepage opened, wait for path availability
    }).then((result) => {

      // Update terminal as installation happens
      let prereqsStatus = () => {

        // Figure out what's missing
        let ffmpeg = utils.commandExists('ffmpeg'),
            ffprobe = utils.commandExists('ffprobe');

        // Build output message
        let msg = lang('setup.prereqs.message.waiting') + '\n\n' +
                  '  ' + lang('setup.prereqs.status.ffmpeg', ( ffmpeg ? '{green:\u2713}' : '{red:\u2717}' )) + '\n' +
                  '  ' + lang('setup.prereqs.status.ffprobe', ( ffprobe ? '{green:\u2713}' : '{red:\u2717}' )) + '\n\n' +
                  lang('setup.prereqs.message.next');

        // Output status
        utils.output('Prerequisites', msg, 0, 6);

        // Success!
        if ( ffmpeg && ffprobe ) {
          clearInterval(timer);
          return resolve();
        }
      };

      // Update user
      prereqsStatus();
      
      // Start a timer to keep updating
      let timer = setInterval(prereqsStatus, 5000);

    }).catch((err) => {
      return reject(err);
    });
  });
};
