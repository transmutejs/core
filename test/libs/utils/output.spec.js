'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const utils = __require('libs/utils');

// Helper to clear and output text to cli
describe('Function "output"', () => {

  it('should export a function', () => {
    expect(utils.output).to.be.a('function');
  });

});
