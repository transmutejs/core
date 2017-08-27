'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const utils = require('../../../app/libs/utils');

describe('Function "metadata"', () => {

  it('should export a function', () => {
    expect(utils.metadata).to.be.a('function');
  });

});
