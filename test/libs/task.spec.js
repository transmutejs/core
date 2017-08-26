'use strict';

// Load requirements
const path = require('path');

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const task = require('../../app/libs/task');

// Define the test data directory
let directory = path.resolve('./test/data/task/validate');

// Define the available functions
const taskFunctions = [
  'listing',
  'create',
];

// Define the available objects
const taskObjects = [
  'format',
  'validate'
];

// Convert string to camelCase
function camelCase(string) {
  return string.replace(/-([a-z])/ig, function(all, letter) {
    return letter.toUpperCase();
  });
}

// Describe the module
describe('Task module', () => {

  it('should export an object', () => {
    expect(task).to.be.an('object');
  });

  it('should contain the ' + taskFunctions.length + ' expected functions', () => {

    taskFunctions.forEach((func) => {

      let property = camelCase(func);

      expect(task).to.have.property(property).that.is.a('function');
    });  
  });

  it('should contain the ' + taskObjects.length + ' expected objects', () => {

    taskObjects.forEach((obj) => {

      let property = camelCase(obj);

      expect(task).to.have.property(property).that.is.an('object');
    });  
  });

  // Load sub-function specs
  taskFunctions.forEach((func) => {
    require('./task/' + func + '.spec');
  });

  // Load sub-module specs
  taskObjects.forEach((obj) => {
    require('./task/' + obj + '.spec');
  });

});
