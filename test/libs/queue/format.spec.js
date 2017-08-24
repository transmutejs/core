'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const queue = require('../../../app/lib/queue');

// Define the available functions
const formatFunctions = ['add', 'remove', 'clear', 'reset', 'regex', 'match'];

// Creates a pseudo unique string of a given length
describe('Class "format"', () => {

  it('should export an object', () => {
    expect(queue.format).to.be.an('object');
  });

  it('should contain 2 properties', () => {
    expect(queue.format).to.have.property('formats').that.is.an('array');
    expect(queue.format).to.have.property('pattern').that.is.an.instanceOf(RegExp);
  });

  it('should export ' + formatFunctions.length + ' functions', () => {
    formatFunctions.forEach((func) => {
      expect(queue.format).to.have.property(func).that.is.a('function');
    });
  });

  // Load sub-module specs
  formatFunctions.forEach((func) => {
    require('./format/' + func + '.spec');
  });

});
