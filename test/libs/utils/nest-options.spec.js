'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const utils = require('../../../app/lib/utils');

// Nests command line arguments by a character, default colon
describe('Function "nestOptions"', () => {
  
  it('should export a function', () => {
    expect(utils.nestOptions).to.be.a('function');
  });

  it('should return an object', () => {
    
    const nestOptionsResult = utils.nestOptions({foo: 'bar'});
    
    expect(nestOptionsResult).to.be.an('object');
  });

  it('should return a flat object without any items to nest', () => {
    
    const nestOptionsResult = utils.nestOptions({foo: 'bar', baz: 'qux'});
    
    expect(nestOptionsResult).to.have.all.keys(['foo', 'baz']);
  });

  it('should nest a set of values seperated by a colon', () => {
    
    const nestOptionsResult = utils.nestOptions({foo: 'bar', 'baz:qux': 'quux'});
    
    expect(nestOptionsResult).to.have.property('baz')
                             .that.is.an('object')
                             .that.includes({qux: 'quux'});
  });

  it('should deeply nest an object with multiple colons', () => {
    
    const nestOptionsResult = utils.nestOptions({foo: 'bar', 'baz:qux:quux': 'quuz', 'baz:qux:corge': 'grault'});
    
    expect(nestOptionsResult).to.have.property('baz')
                             .that.is.an('object')
                             .that.has.property('qux')
                             .that.is.an('object')
                             .that.includes({quux: 'quuz', corge: 'grault'});
  });

  it('should allow customisation of the delimiter', () => {
    
    const nestOptionsResult = utils.nestOptions({foo: 'bar', 'baz.qux': 'quux'}, '.');
    
    expect(nestOptionsResult).to.have.property('baz')
                             .that.is.an('object')
                             .that.includes({qux: 'quux'});
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
    
    const nestOptionsResult = utils.nestOptions({foo: 'bar', 'foo:bar': 'baz'});
    
    expect(nestOptionsResult).to.be.an('object')
                             .have.property('foo')
                             .that.is.a('string')
                             .and.equals('bar');
  });

});
