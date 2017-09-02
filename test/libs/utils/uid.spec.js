'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const utils = __require('libs/utils');

// Creates a pseudo unique string of a given length
describe('Function "uid"', () => {

  it('should export a function', () => {
    expect(utils.uid).to.be.a('function');
  });

  it('should return a string', () => {
    
    const uidResult = utils.uid(1);
    
    expect(uidResult).to.be.a('string');
  });

  it('should match the given length', () => {
    
    const uidResult = utils.uid(16);

    expect(uidResult).to.be.a('string')
                     .and.to.have.length(16);
  });

  it('should limit the string length to 32 characters', () => {

    const uidResult = utils.uid(128);

    expect(uidResult).to.be.a('string')
                     .and.to.have.length(32);
  });

  it('should handle being given a non-numeric length', () => {

    const uidResult = utils.uid('foo');

    expect(uidResult).to.be.a('string')
                     .and.to.have.length(10);
  });

});
