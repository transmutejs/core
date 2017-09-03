'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const job = __require('libs/job'),
      utils = __require('libs/utils');

// Define the available functions
const cacheFunctions = [
  'normalize',
  'episode-key',
  'find-show',
  'find-episode',
  'save'
];

// Creates a pseudo unique string of a given length
describe('Class "cache"', () => {

  it('should export an object', () => {
    expect(job.cache).to.be.an('object');
  });

  it('should export ' + cacheFunctions.length + ' functions', () => {
    cacheFunctions.forEach((func) => {

      let property = utils.camelCase(func);

      expect(job.cache).to.have.property(property).that.is.a('function');
    });
  });

  // Load sub-module specs
  cacheFunctions.forEach((func) => {
    require('./cache/' + func + '.spec');
  });

});
