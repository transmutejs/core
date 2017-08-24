'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const queue = require('../../app/lib/queue');

// Define the available functions
const queueFunctions = [
  'format',
  'listing'
];

// Convert string to camelCase
function camelCase(string) {
  return string.replace(/-([a-z])/ig, function(all, letter) {
    return letter.toUpperCase();
  });
}

// Describe the module
describe('Queue module', () => {

  it('should export an object', () => {
    expect(queue).to.be.an('object');
  });

  it('should contain the ' + queueFunctions.length + ' expected functions', () => {

    expect(Object.keys(queue)).to.have.length(queueFunctions.length);

    queueFunctions.forEach((func) => {

      let property = camelCase(func);

      expect(queue).to.have.property(property);
    });  
  });

  // Load sub-module specs
  queueFunctions.forEach((func) => {
    require('./queue/' + func + '.spec');
  });

});
