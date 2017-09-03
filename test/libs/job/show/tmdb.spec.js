'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const tmdb = __require('libs/job/show/tmdb');

describe('Class "tmdb"', () => {

  it('should export a function', () => {
    expect(tmdb).to.be.a('function');
  });

});
