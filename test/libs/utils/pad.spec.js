'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const utils = __require('libs/utils');

// Left pads a string to a given length with a given character
describe('Function "pad"', () => {

  it('should export a function', () => {
    expect(utils.pad).to.be.a('function');
  });

});
