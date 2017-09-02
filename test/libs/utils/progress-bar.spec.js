'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const utils = __require('libs/utils');

// Returns a standardised instance of a progress bar for CLI
describe('Function "progressBar"', () => {

  it('should export a function', () => {
    expect(utils.progressBar).to.be.a('function');
  });

});
