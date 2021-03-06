'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const task = __require('libs/task');

// Define the available functions
const validateFunctions = ['error', 'file', 'object'];

// Creates a pseudo unique string of a given length
describe('Class "validate"', () => {

  it('should export an object', () => {
    expect(task.validate).to.be.an('object');
  });

  it('should export ' + validateFunctions.length + ' functions', () => {
    validateFunctions.forEach((func) => {
      expect(task.validate).to.have.property(func).that.is.a('function');
    });
  });

  // Load sub-module specs
  validateFunctions.forEach((func) => {
    require('./validate/' + func + '.spec');
  });

});
