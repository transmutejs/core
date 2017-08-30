'use strict';

// Load requirements
const logger = require(__base + 'libs/log');

// Define default formats
const defaultFormats = ['mkv', 'mp4', 'avi', 'flv', 'mov', 'wmv'];

module.exports = {

  // The default formats to support
  formats: defaultFormats.slice(0),

  // Regex pattern to handle extension matching of the above formats
  pattern: new RegExp('\.(' + defaultFormats.join('|') + ')$', 'i'),

  // Add a new format to the available list
  add: function(format) {

    // Check for an array and recurse
    if ( Array.isArray(format) ) {
      return format.every((item) => { return this.add(item); });
    }

    // Not a string, can't do anything with it
    if ( typeof format !== 'string' ) {
      return false;
    }

    // Already in the list, skip but don't fail
    if ( this.formats.includes(format) ) {
      return true;
    }

    // DEBUG
    logger.verbose('Adding - ' + format);

    // Update formats and regex pattern
    this.formats.push(format);
    this.pattern = this.regex();

    return true;
  },

  // Remove a format 
  remove: function(format) {

    // Check for an array and recurse
    if ( Array.isArray(format) ) {
      return format.every((item) => { return this.remove(item); });
    }

    // Not a string, can't do anything with it
    if ( typeof format !== 'string' ) {
      return false;
    }

    // Not in the list, skip but don't fail
    if ( ! this.formats.includes(format) ) {
      return true;
    }

    // DEBUG
    logger.verbose('Removing - ' + format);

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
    this.pattern = /\.([a-z0-9]{2,5})$/i;

    // DEBUG
    logger.verbose('Clearing formats');

    return true;
  },

  // Resets the available formats
  reset: function() {

    // Reset and generate regex pattern
    this.formats = defaultFormats.slice(0);
    this.pattern = this.regex();

    // DEBUG
    logger.verbose('Reset formats');

    return true;
  },

  // Builds a regex pattern from the format arary
  regex: function() {

    // Run through formats and make them safe
    let cleanFormats = this.formats.map((item) => {
      return item.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    });

    // Build the regex object
    return new RegExp('\.(' + cleanFormats.join('|') + ')$', 'i');
  },

  // Does a given filename/path match the available formats
  match: function(file) {

    // Check for an array and recurse
    if ( Array.isArray(file) ) {
      return file.every((item) => { return this.match(item); });
    }

    // Not a string, can't do anything with it
    if ( typeof file !== 'string' ) {
      return false;
    }

    // Send back the result
    return file.trim().match(this.pattern) !== null ? true : false;
  }

};
