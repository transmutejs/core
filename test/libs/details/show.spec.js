'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

// Load our module
const show = require('../../../app/libs/details/show');

describe('Function "show"', () => {

  it('should export a function', () => {
    expect(show).to.be.a('function');
  });

  it('should return a promise', () => {

    let tvResult = show();

    return expect(tvResult).to.be.a('promise')
                           .and.to.eventually.be.rejected;
  });

  it('should send a rejection when passed no arguments', () => {

    let tvResult = show();

    return expect(tvResult).to.eventually.be.rejected;
  });

});
