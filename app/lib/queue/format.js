'use strict';

module.exports = {

  formats: ['mkv', 'mp4', 'avi', 'flv', 'mov', 'wmv'],

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

    this.formats.psuh(format);
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
    return true;
  },

  clear: function() {
    this.formats = [];
    return true;
  },

  match: function(file) {

    if ( typeof file !== 'string' ) {
      return false;
    }

    let regex = new RegExp('\.(' + this.formats.join('|') + ')$', 'gi');

    return file.match(regex);
  }

};
