'use strict';

// Load requirements
const assign = require('deep-assign'),
      path = require('path'),
      fs = require('fs');

// Helper utilities
module.exports = {

  assignDefaults: function(opts) {
    return assign(require('./defaults'), opts);
  },

  getMethods: function(obj) {

    let ignore = ['config', 'getMethods'];

    return Object.getOwnPropertyNames(obj).filter((property) => {
      return ( typeof obj[property] === 'function' && ! ignore.includes(property) );
    });
  },

  pad: function(n, width) {
    n = n.toString();
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
  },

  clean: function(str) {
    return str.replace(/[^a-z0-9\s\.-]+/gmi, ' ')
              .replace(/[\s|\.]+/gmi, ' ')
              .replace(/\s/gmi, '.');
  },

  getCodecs: function(streams) {

    let codecs = {video: {}, audio: {}};

    streams.forEach((data) => {
      if ( data.codec_type === 'video' ) {
        codecs.video = {
          codec: data.codec_name.replace('h', 'x'),
          resolution: data.height + 'p',
          depth: data.bits_per_raw_sample + 'bit'
        };
      } else if ( data.codec_type === 'audio' ) {
        codecs.audio = {
          codec: data.codec_name,
          channels: data.channels + '.1'
        };
      }
    });

    return codecs;
  },

  buildDir: function(file, target) {

    let basename = './';

    if ( target && path.isAbsolute(target) ) {
      basename = target;
    } else {
      basename = path.dirname(file) + ( target ? '/' + target : '' );
    }
  
    // Create the directory if needed
    if ( ! fs.existsSync(basename) ) {
      fs.mkdirSync(basename);
    }

    return basename;
  },

  buildName: function(pattern, file, options, metadata, details) {

    // Variables
    let regex = /(%(\.)?([a-z]{1,2}))/gmi,
        codecs = this.getCodecs(metadata.streams),
        str = pattern,
        m;

    // Build data object
    let replacements = {
      t: details.name,
      n: ( details.type === 'show' ? details.show.name : '' ) || null,
      y: ( details.type === 'show' ? details.show.year : details.year ) || null,
      ex: options.format,
      vc: ( options.video.codec === 'copy' ? codecs.video.codec : options.video.codec.replace('lib', '').replace('h', 'x') ),
      r: codecs.video.resolution || null,
      vd: codecs.video.depth || null,
      ac: codecs.audio.codec || null,
      ad: codecs.audio.channels || null,
      ss: this.pad(details.season || '0', 2),
      s: details.season || '0',
      ee: this.pad(details.season || '0', 2),
      e: details.episode || '0'
    };

    // Are there any custom replacements in options
    if ( typeof options.replacements === 'object' ) {
      replacements = assign(replacements, options.replacements);
    }

    // Find available replacements in pattern
    while ( ( m = regex.exec(pattern) ) !== null ) {
    
      // This is necessary to avoid infinite loops with zero-width matches
      if ( m.index === regex.lastIndex ) { regex.lastIndex++; }
    
      m.forEach((match, i) => { // jshint ignore:line
        let val = replacements[m[3]];
        str = str.replace(m[1], ( m[2] !== undefined ? this.clean(val) : val ));
      });
    }

    // Sample suffix
    if ( options.preview ) {
      str.replace('.' + replacements.ex, '-sample.' + replacements.ex);
    }

    // Clean and send it back
    return this.clean(str);
  }

};
