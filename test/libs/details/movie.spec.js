'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

// Load our module
const details = require('../../../app/libs/details');

describe('Function "movie"', () => {

  it('should export a function', () => {
    expect(details.movie).to.be.a('function');
  });

  it('should return a promise', () => {

    let movieResult = details.movie();

    return expect(movieResult).to.be.a('promise')
                              .and.to.eventually.be.rejected;
  });

  it('should resolve when passed an argument', () => {

    let movieResult = details.movie('test.mkv');

    return expect(movieResult).to.eventually.be.fulfilled;
  });

  it('should send a rejection when passed no arguments', () => {

    let movieResult = details.movie();

    return expect(movieResult).to.eventually.be.rejected;
  });

});
