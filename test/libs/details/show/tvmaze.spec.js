'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const tvmaze = require('../../../../app/libs/details/show/tvmaze');

describe('Class "tvmaze"', () => {

  it('should export a function', () => {
    expect(tvmaze).to.be.a('function');
  });

});
