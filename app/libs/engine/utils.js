'use strict';

// Load requirements
const assign = require('deep-assign'),
      path = require('path'),
      fs = require('fs');

// Load modules
const utils = __require('libs/utils');

// Helper utilities
module.exports = {

  assignDefaults: function(opts) {
    return assign(require('./data/defaults'), opts);
  },

  // ucfirst
  capitalize: function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  // Gets a stream title from the metadata
  getStreamTitle: function(stream) {
    return stream.title || stream.tags ? stream.tags.title : undefined;
  },

  // Format stream language
  normalizeStreamLanguage: function(stream) {
    let lang = stream.language || stream.tags ? stream.tags.language : undefined;
    return utils.normalizeLanguage(lang);
  },

  // Creates a standard naming convention for audio tracks
  getFormatedChannels: function(channels) {
    
    if ( channels === 1 ) {
      return 'Mono';
    } else if ( channels === 2 ) {
      return 'Stereo';
    } else if ( channels % 2 ) {
      return channels + '.0 Channel';
    } else {
      return (channels - 1) + '.1 Channel';
    }
  },

  clean: function(str) {

    if ( typeof str !== 'string') { return str; }

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
          channels: this.getFormatedChannels(data.channels).replace(/[^0-9\.]+/ig, '')
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
      ss: utils.pad(details.season || '0', 2),
      s: details.season || '0',
      ee: utils.pad(details.season || '0', 2),
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
      str = str.replace('.' + replacements.ex, '-sample.' + replacements.ex);
    }

    // Clean and send it back
    return this.clean(str);
  }

};
