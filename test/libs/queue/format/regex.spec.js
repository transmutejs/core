'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const format = require('../../../../app/lib/queue/format');

// Describe the module
describe('Function "regex"', () => {

  it('should export a function', () => {
    expect(format.regex).to.be.a('function');
  });

});
