'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const cli = __require('libs/cli'),
      utils = __require('libs/utils');

// Define the available functions
const cliFunctions = [
  'input',
  'start'
];

// Describe the module
describe('CLI module', () => {

  it('should export an object', () => {
    expect(cli).to.be.an('object');
  });

  it('should contain 2 properties', () => {
    expect(cli).to.have.property('ready').that.is.a('boolean');
    expect(cli).to.have.property('options').that.is.an('object');
  });

  it('should contain the ' + cliFunctions.length + ' expected functions', () => {

    cliFunctions.forEach((func) => {

      let property = utils.camelCase(func);

      expect(cli).to.have.property(property);
    });  
  });

  // Load sub-module specs
  cliFunctions.forEach((func) => {
    require('./cli/' + func + '.spec');
  });

});
