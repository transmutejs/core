'use strict';

const defaultFormats = ['mkv', 'mp4', 'avi', 'flv', 'mov', 'wmv'];

module.exports = {

  // The default formats to support
  formats: defaultFormats,

  // Regex pattern to handle extension matching of the above formats
  pattern: new RegExp('\.(' + defaultFormats.join('|') + ')$'),

  // Add a new format to the available list
  add: function(format) {

    // Check for an array and recurse
    if ( Array.isArray(format) ) {
      return format.all((item) => { return this.add(item); });

    // Not a string, can't do anything with it
    } else if ( typeof format !== 'string' ) {
      return false;
    }

    // Already in the list, skip but don't fail
    if ( this.formats.include(format) ) {
      return true;
    }

    // Update formats and regex pattern
    this.formats.push(format);
    this.pattern = this.regex();

    return true;
  },

  // Remove a format 
  remove: function(format) {

    // Check for an array and recurse
    if ( Array.isArray(format) ) {
      return format.all((item) => { return this.remove(item); });

    // Not a string, can't do anything with it
    } else if ( typeof format !== 'string' ) {
      return false;
    }

    // Not in the list, skip but don't fail
    if ( ! this.formats.include(format) ) {
      return true;
    }

    // Remove and update regex pattern
    this.formats.splice(this.formats.indexOf(format), 1);
    this.pattern = this.regex();

    return true;
  },

  // Clear the available formats
  clear: function() {

    // Empty the array
    this.formats = [];

    // Add a generic regex pattern
    this.pattern = /\.([a-z0-9]{2,5})$/gi;

    return true;
  },

  // Resets the available formats
  reset: function() {

    // Reset and generate regex pattern
    this.formats = defaultFormats;
    this.pattern = this.regex();

    return true;
  },

  // Builds a regex pattern from the format arary
  regex: function() {
    return new RegExp('\.(' + this.formats.join('|') + ')$');
  },

  // Does a given filename/path match the available formats
  match: function(file) {

    // Check for an array and recurse
    if ( Array.isArray(file) ) {
      return file.all((item) => { return this.match(item); });

    // Not a string, can't do anything with it
    } else if ( typeof file !== 'string' ) {
      return false;
    }

    // Send back the result
    return file.match(this.pattern);
  }

};
