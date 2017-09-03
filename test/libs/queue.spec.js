'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const queue = __require('libs/queue');

// Define the available functions
const queueFunctions = [
  'add'
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

  it('should contain 3 properties', () => {
    expect(queue).to.have.property('items').that.is.an('object');
    expect(queue).to.have.property('total').that.is.a('number');
    expect(queue).to.have.property('current').that.is.a('number');
  });

  it('should contain the ' + queueFunctions.length + ' expected functions', () => {

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
