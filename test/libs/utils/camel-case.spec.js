'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const utils = require('../../../app/libs/utils');

describe('Function "camelCase"', () => {

  it('should export a function', () => {
    expect(utils.camelCase).to.be.a('function');
  });

});
