'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const cache = __require('libs/job/cache');

// Describe the module
describe('Function "save"', () => {

  it('should export a function', () => {
    expect(cache.save).to.be.a('function');
  });

});
