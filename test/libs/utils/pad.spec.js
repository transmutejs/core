'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const utils = __require('libs/utils');

// Left pads a string to a given length with a given character
describe('Function "pad"', () => {

  it('should export a function', () => {
    expect(utils.pad).to.be.a('function');
  });

  it('should return a string', () => {

    let padResult = utils.pad('foo');

    expect(padResult).to.be.a('string')
                     .and.to.equal('foo');
  });

  it('should left pad a number with zeros to a given length', () => {

    let padResult = utils.pad('1', 2);

    expect(padResult).to.be.a('string')
                     .to.have.length(2)
                     .and.to.equal('01');
  });

  it('should left pad with a given string to a length', () => {

    let padResult = utils.pad('foo', 5, ' ');

    expect(padResult).to.be.a('string')
                     .to.have.length(5)
                     .and.to.equal('  foo');
  });

});
