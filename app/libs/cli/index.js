'use strict';

// Load requirements
const dashdash = require('dashdash'),
      spawn = require('child_process'),
      os = require('os');

// Load modules
const utils = require('../utils'),
      locale = require('../locale');

// Export for use
module.exports = {

  input: function() {

    // Add option validation to dash dash
    this.addBitdepthOption()
        .addPresetOption()
        .addTuningOption();

    // Build the parser with our configured options
    let parser = dashdash.createParser(require('./data/options.json'));

    // Get the command line arguments
    let options = utils.nestOptions(parser.parse(process.argv));

    // Add additional arguments
    options.platform = this.getPlatform();
    options.hwAccel  = this.getHwAccel();
    // options.temp  = ( config[options.platform].temp ? config[options.platform].temp : false );

    // Handle help output
    if ( options.help ) {
      let help = parser.help({includeEnv: true}).trimRight();
      console.log(utils.colorString(lang('HELP.DIALOG')), help.replace(/=/g, ' '));
      return process.exit(0);
    }

    return options;
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
          return true;
        }
      }
    }

    return false;
  }

};
