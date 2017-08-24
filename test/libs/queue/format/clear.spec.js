'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const format = require('../../../../app/lib/queue/format');

// Describe the module
describe('Function "clear"', () => {

  it('should export a function', () => {
    expect(format.clear).to.be.a('function');
  });

});
