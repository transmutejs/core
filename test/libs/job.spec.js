'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const job = __require('libs/job');

// Define the available functions
const jobFunctions = [
  'show',
  'movie'
];

// Define the available classes
const jobClasses = [
  'metadata',
  'cache',
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
describe('Job module', () => {

  it('should export an object', () => {
    expect(job).to.be.an('object');
  });

  it('should contain the ' + jobFunctions.length + ' expected functions', () => {

    jobFunctions.forEach((func) => {

      let property = camelCase(func);

      expect(job).to.have.property(property).that.is.a('function');
    });  
  });

  describe('Function "build"', () => {

    it('should export a function', () => {
      expect(job.build).to.be.a('function');
    });

    it('should return a promise', () => {

      let jobResult = job.build();

      return expect(jobResult).to.be.a('promise')
                                   .and.to.eventually.be.rejected;
    });

    it('should send a rejection when passed no arguments', () => {

      let jobResult = job.build();

      return expect(jobResult).to.eventually.be.rejected;
    });

    it('should send a rejection when passed an invalid task type', () => {

      let jobResult = job.build({
        file: './path/to/file.mkv',
        basename: 'file.mkv',
        type: 'invalid'
      });

      return expect(jobResult).to.eventually.be.rejected;
    });

  });

  // Load sub-module specs
  jobFunctions.forEach((func) => {
    require('./job/' + func + '.spec');
  });

  // Load provider specs
  jobClasses.forEach((provider) => {
    require('./job/' + provider + '.spec');
  });

});
