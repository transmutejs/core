'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

// Load our module
const movie = require('../../../app/libs/job/movie');

describe('Function "movie"', () => {

  it('should export a function', () => {
    expect(movie).to.be.a('function');
  });

  it('should return a promise', () => {

    let movieResult = movie();

    return expect(movieResult).to.be.a('promise')
                              .and.to.eventually.be.rejected;
  });

  it('should send a rejection when passed no arguments', () => {

    let movieResult = movie();

    return expect(movieResult).to.eventually.be.rejected;
  });

  // Temporary
  it('should resolve when given a filename', () => {

    let movieResult = movie('foobar');

    return expect(movieResult).to.eventually.be.fulfilled;
  });

});
