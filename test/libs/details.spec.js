'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const details = require('../../app/libs/details');

// Define the available functions
const detailsFunctions = [
  'show',
  'movie'
];

// Define the available classes
const detailsClasses = [
  'metadata',
  'show/tvmaze',
  'show/tmdb'
];

// Convert string to camelCase
function camelCase(string) {
  return string.replace(/-([a-z])/ig, function(all, letter) {
    return letter.toUpperCase();
  });
}

// Describe the module
describe('Details module', () => {

  it('should export an object', () => {
    expect(details).to.be.an('object');
  });

  it('should contain the ' + detailsFunctions.length + ' expected functions', () => {

    detailsFunctions.forEach((func) => {

      let property = camelCase(func);

      expect(details).to.have.property(property).that.is.a('function');
    });  
  });

  describe('Function "get"', () => {

    it('should export a function', () => {
      expect(details.get).to.be.a('function');
    });

    it('should return a promise', () => {

      let detailsResult = details.get();

      return expect(detailsResult).to.be.a('promise')
                                   .and.to.eventually.be.rejected;
    });

    it('should send a rejection when passed no arguments', () => {

      let detailsResult = details.get();

      return expect(detailsResult).to.eventually.be.rejected;
    });

    it('should send a rejection when passed an invalid task type', () => {

      let detailsResult = details.get({
        file: './path/to/file.mkv',
        basename: 'file.mkv',
        type: 'invalid'
      });

      return expect(detailsResult).to.eventually.be.rejected;
    });

  });

  // Load sub-module specs
  detailsFunctions.forEach((func) => {
    require('./details/' + func + '.spec');
  });

  // Load provider specs
  detailsClasses.forEach((provider) => {
    require('./details/' + provider + '.spec');
  });

});
