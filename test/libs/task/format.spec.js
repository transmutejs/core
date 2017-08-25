'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const TaskModule = require('../../../app/libs/task');
const task = new TaskModule();

// Define the available functions
const formatFunctions = ['add', 'remove', 'clear', 'reset', 'regex', 'match'];

// Creates a pseudo unique string of a given length
describe('Class "format"', () => {

  it('should export an object', () => {
    expect(task.format).to.be.an('object');
  });

  it('should contain 2 properties', () => {
    expect(task.format).to.have.property('formats').that.is.an('array');
    expect(task.format).to.have.property('pattern').that.is.an.instanceOf(RegExp);
  });

  it('should export ' + formatFunctions.length + ' functions', () => {
    formatFunctions.forEach((func) => {
      expect(task.format).to.have.property(func).that.is.a('function');
    });
  });

  // Load sub-module specs
  formatFunctions.forEach((func) => {
    require('./format/' + func + '.spec');
  });

});
