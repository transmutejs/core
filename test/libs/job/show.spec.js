'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

// Load our module
const show = __require('libs/job/show');

describe('Function "show"', () => {

  it('should export a function', () => {
    expect(show).to.be.a('function');
  });

  it('should return a promise', () => {

    let tvResult = show();

    return expect(tvResult).to.be.a('promise')
                           .and.to.eventually.be.rejected;
  });

  it('should resolve with an empty object when unable to parse filename', () => {

    let tvResult = show('not-a-helpful-filename.mkv');

    return expect(tvResult).to.eventually.be.fulfilled
                           .and.to.be.an('object');
  });

  it('should send a rejection when passed no arguments', () => {

    let tvResult = show();

    return expect(tvResult).to.eventually.be.rejected;
  });

  it('should be rejected when given an invalid season/episode', () => {

    let tvResult = show('castle.s99e01.mkv');

    return expect(tvResult).to.eventually.be.rejected
                           .to.be.a('string')
                           .and.to.match(/no results/ig);
  });

});
