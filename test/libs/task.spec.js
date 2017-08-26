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
  'prepare',
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

  it('should export a function', () => {
    expect(task).to.be.a('function');
  });

  it('should throw an exception when instantiated with an invalid schema', () => {
    expect(() => { new task({}); }).to.throw(/should have required property/ig);
  });

  it('should throw an exception when an invalid schema is added', () => {
    
    let taskInstance = new task();

    expect(() => { taskInstance.add({}); }).to.throw(/should have required property/ig);
  });

  it('should assign valid data to the class object', () => {

    let file = path.join(directory, 'object.valid.json');

    let taskInstance = new task(require(file));

    expect(taskInstance.data).to.be.an('object')
                             .with.all.keys(['name', 'directory', 'type', 'seasons', 'options']);
  });

  it('should contain the ' + taskFunctions.length + ' expected functions', () => {

    let taskInstance = new task();

    taskFunctions.forEach((func) => {

      let property = camelCase(func);

      expect(taskInstance).to.have.property(property).that.is.a('function');
    });  
  });

  it('should contain the ' + taskObjects.length + ' expected objects', () => {

    let taskInstance = new task();

    taskObjects.forEach((obj) => {

      let property = camelCase(obj);

      expect(taskInstance).to.have.property(property).that.is.an('object');
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
