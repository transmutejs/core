'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

// Load our module
const details = require('../../../app/libs/details');

describe('Function "tv"', () => {

  it('should export a function', () => {
    expect(details.tv).to.be.a('function');
  });

  it('should return a promise', () => {

    let tvResult = details.tv();

    return expect(tvResult).to.be.a('promise')
                           .and.to.eventually.be.rejected;
  });

  it('should send a rejection when passed no arguments', () => {

    let tvResult = details.tv();

    return expect(tvResult).to.eventually.be.rejected;
  });

});
