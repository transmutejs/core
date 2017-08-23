'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const logger = require('../../app/lib/log');

// Describe the module
describe('Log module', () => {

  it('should export an object', () => {
    expect(logger).to.be.a('object');
  });

});