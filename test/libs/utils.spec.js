'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const utils = __require('libs/utils');

// Define the available functions
const utilFunctions = [
  'camel-case',
  'color-string',
  'command-exists',
  'framerate',
  'get-methods',
  'metadata',
  'nest-options',
  'normalize-language',
  'output',
  'pad',
  'progress-bar',
  'request',
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

    utilFunctions.forEach((func) => {

      let property = utils.camelCase(func);

      expect(utils).to.have.property(property).that.is.a('function');
    });  
  });

  // Load sub-module specs
  utilFunctions.forEach((func) => {
    require('./utils/' + func + '.spec');
  });

});
