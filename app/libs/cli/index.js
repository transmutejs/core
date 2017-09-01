'use strict';

// Load requirements
const dashdash = require('dashdash'),
      spawn = require('child_process'),
      path = require('path'),
      os = require('os'),
      fs = require('fs');

// Load modules
const utils = __require('libs/utils'),
      locale = __require('libs/locale'),
      logger = __require('libs/log'),
      settings = __require('libs/settings');

// Package info
const pkg = require(path.resolve(path.join(__base, '../package')));

// Export for use
module.exports = {

  ready: false,

  options: {},

  input: function() {
    return new Promise((resolve, reject) => {

      // Variables
      let options = {};

      // Add option validation to dash dash
      this.addBitdepthOption()
          .addPresetOption()
          .addTuningOption();

      // Build the parser with our configured options
      let parser = dashdash.createParser(require('./data/options.json'));

      // Get the command line arguments
      try {
        options = utils.nestOptions(parser.parse(process.argv));
      } catch (e) {
        return reject(e.message);
      }

      // Add additional arguments
      options.platform = this.getPlatform();
      options.hwAccel = this.getHwAccel();
      options.temp = ( settings.platform[options.platform].temp ? settings.platform[options.platform].temp : false );

      // Handle help output
      if ( options.help ) {
        let help = parser.help({includeEnv: true}).trimRight();
        console.log(utils.colorString(lang('cli.help')), help.replace(/=/g, ' '));
        return process.exit(0);
      }

      // Start up, clear console and display header
      this.start();

      // Assign options for use later if needed
      this.options = options;

      // Set to ready
      this.ready = true;

      // Resolve with args  
      return resolve(options);
    });
  },

  addBitdepthOption: function() {

    let options = [8, 10, 12];

    dashdash.addOptionType({
      name: 'bitdepth',
      takesArg: true,
      helpArg: '<' + options.join('|') + '>',
      parseArg: function(option, optstr, arg) {
        if ( ~options.indexOf(parseInt(arg)) ) { return parseInt(arg); }
      }
    });

    return this;
  },

  addPresetOption: function() {

    let options = ['ultrafast', 'superfast', 'veryfast', 'faster', 'fast', 'medium', 'slow', 'slower', 'veryslow', 'placebo'];

    dashdash.addOptionType({
      name: 'preset',
      takesArg: true,
      helpArg: '<' + options.join('|') + '>',
      parseArg: function(option, optstr, arg) {
        if ( ~options.indexOf(arg.toLowerCase()) ) { return arg.toLowerCase(); }
      }
    });

    return this;
  },

  addTuningOption: function() {

    let options = ['psnr', 'ssim', 'grain', 'fastdecode', 'zerolatency'];

    dashdash.addOptionType({
      name: 'tuning',
      takesArg: true,
      helpArg: '<' + options.join('|') + '>',
      parseArg: function(option, optstr, arg) {
        if ( ~options.indexOf(arg.toLowerCase()) ) { return arg.toLowerCase(); }
      }
    });

    return this;
  },

  // Returns the current OS
  getPlatform: function() {
    return os.platform();
  },

  // Detect hardware acceleration
  getHwAccel: function() {

    // Windows only for now
    if ( this.getPlatform() !== 'win32' ) { return false; }

    // Require gpu info parser only
    const gpuInfo = require('../node_modules/gpu-info/lib/windowsParser.js');

    // Get GPU data string from windows
    let output = spawn.execSync('wmic path win32_VideoController', {encoding: 'utf8'});

    // Parse out the GPUs
    let data = gpuInfo.parse(output);

    // Look for 10 series+ card
    for ( let gpu of data ) {
      if ( gpu.AdapterCompatibility === 'NVIDIA' ) {
        if ( /1[0-9]{3}/g.exec(gpu.VideoProcessor) !== null ) {
          logger.info('Nvidia 10 Series card found, unlocking hardware acceleration.');
          logger.info('NVENC has limited support for the following arguments:\n\n  - You must use bitrate rather than crf\n  - Preset must be either slow or fast');
          return true;
        }
      }
    }

    return false;
  },

  // Output cli header
  start: function() {

    // Clear terminal
    process.stdout.write('\x1Bc');

    // Get the title output
    let file = path.join(__base, 'libs/cli/data/title.txt'),
        title = fs.readFileSync(file, 'utf8'),
        length = title.split('\n').slice(-1).pop().length;

    // Output the title
    console.log(utils.colorString('{magenta:%s}'), title);

    // Output version
    let version = utils.pad('v' + pkg.version, length, ' ');
    console.log(utils.colorString('{cyan:%s}\n'), version);

    // Return for chaining
    return this;
  }

};
