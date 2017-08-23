'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const utils = require('../../../app/lib/utils');

// Nests command line arguments by a character, default colon
describe('Function "nestOptions"', () => {
  
  it('should export a function', () => {
    expect(utils.nestOptions).to.be.a('Function');
  });

  it('should return an object', () => {
    const nestOptionsResult = utils.nestOptions({foo: 'bar'});
    expect(nestOptionsResult).to.be.an('object');
  });

  it('should return a flat object without any items to nest', () => {

  });

  it('should nest a set of values seperated by a colon', () => {

  });

  it('should deeply nest an object with multiple colons', () => {

  });

  it('should allow customisation of the delimiter', () => {

  });

  it('should remove entries starting with an underscore', () => {
    const nestOptionsResult = utils.nestOptions({foo: 'bar', '_baz': 'qux'});
    expect(nestOptionsResult).to.be.an('object')
                             .have.property('foo')
                             .and.not.have.property('_baz');
  });

  it('should return an empty object when given an invalid input type', () => {
    const nestOptionsResult = utils.nestOptions('foo');
    expect(nestOptionsResult).to.be.an('object');
  });

  it('should still produce output when it finds a key collision', () => {

  });

});
