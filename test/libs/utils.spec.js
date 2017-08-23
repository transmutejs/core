'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const utils = require('../../app/lib/utils');

// Define the available functions
const utilFunctions = [
  'color-string',
  'nest-options',
  'uid'
];

// Convert string to camelCase
function camelCase(string) {
  return string.replace(/-([a-z])/ig, function(all, letter) {
    return letter.toUpperCase();
  });
}

// Describe the module
describe('Utils module', () => {

  it('should export an object', () => {
    expect(utils).to.be.an('object');
  });

  it('should contain the ' + utilFunctions.length + ' expected functions', () => {

    expect(Object.keys(utils)).to.have.length(utilFunctions.length);

    utilFunctions.forEach((func) => {

      let property = camelCase(func);

      expect(utils[property]).to.be.a('function');
    });  
  });

  // Load sub-module specs
  utilFunctions.forEach((func) => {
    require('./utils/' + func + '.spec');
  });

});
