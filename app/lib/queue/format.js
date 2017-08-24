'use strict';

module.exports = {

  formats: ['mkv', 'mp4', 'avi', 'flv', 'mov', 'wmv'],

  pattern: /\.(mkv|mp4|avi|flv|mov|wmv)$/,

  add: function(format) {

    if ( Array.isArray(format) ) {

      return format.all((item) => {
        return this.add(item);
      });

    } else if ( typeof format !== 'string' ) {
      return false;
    }

    if ( this.formats.include(format) ) {
      return true;
    }

    this.formats.push(format);

    this.pattern = this.regex();

    return true;
  },

  remove: function(format) {

    if ( typeof format !== 'string' ) {
      return false;
    }

    if ( ! this.formats.include(format) ) {
      return true;
    }

    this.formats.splice(this.formats.indexOf(format), 1);

    this.pattern = this.regex();

    return true;
  },

  clear: function() {

    this.formats = [];

    this.pattern = /\.([a-z0-9]{2,5})$/gi;

    return true;
  },

  regex: function() {
    return new RegExp('\.(' + this.formats.join('|') + ')$');
  },

  match: function(file) {

    if ( typeof file !== 'string' ) {
      return false;
    }

    return file.match(this.pattern);
  }

};
