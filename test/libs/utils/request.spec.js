'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const utils = require('../../../app/libs/utils');

// Creates a pseudo unique string of a given length
describe('Function "request"', () => {

  it('should export a function', () => {
    expect(utils.request).to.be.a('function');
  });

  it('should return a promise', () => {

    let requestResult = utils.request();

    return expect(requestResult).to.be.a('promise')
                                .and.to.eventually.be.rejected;
  });

  it('should send a rejection when passed no arguments', () => {

    let requestResult = utils.request();

    return expect(requestResult).to.eventually.be.rejected;
  });

});
