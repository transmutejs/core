'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const details = require('../../app/libs/details');

// Define the available functions
const detailsFunctions = [
  'tv',
  'movie'
];

// Convert string to camelCase
function camelCase(string) {
  return string.replace(/-([a-z])/ig, function(all, letter) {
    return letter.toUpperCase();
  });
}

// Describe the module
describe('Details module', () => {

  it('should export an object', () => {
    expect(details).to.be.an('object');
  });

  it('should contain the ' + detailsFunctions.length + ' expected functions', () => {

    detailsFunctions.forEach((func) => {

      let property = camelCase(func);

      expect(details).to.have.property(property).that.is.a('function');
    });  
  });

  // Load sub-module specs
  detailsFunctions.forEach((func) => {
    require('./details/' + func + '.spec');
  });

});
