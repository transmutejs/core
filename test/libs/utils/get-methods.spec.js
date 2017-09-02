'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const utils = __require('libs/utils');

// Returns an array of the methods in a given class
describe('Function "getMethods"', () => {

  it('should export a function', () => {
    expect(utils.getMethods).to.be.a('function');
  });

  it('should return an array', () => {

    let getMethodsResult = utils.getMethods({});

    expect(getMethodsResult).to.be.an('array')
                            .and.to.be.length(0);
  });

  it('should handle being given no input', () => {

    let getMethodsResult = utils.getMethods();

    expect(getMethodsResult).to.be.an('array')
                            .and.to.be.length(0);
  });

  it('should return function names from an object', () => {

    let testObj = {
      foo: function() { return false; },
      bar: 'baz'
    };

    let getMethodsResult = utils.getMethods(testObj);

    expect(getMethodsResult).to.be.an('array')
                            .to.be.length(1)
                            .and.to.include('foo');
  });

  it('should ignore function names passed as the second param', () => {

    let testObj = {
      foo: function() { return false; },
      bar: function() { return true; },
      baz: 'test'
    };

    let getMethodsResult = utils.getMethods(testObj, ['foo']);

    expect(getMethodsResult).to.be.an('array')
                            .to.be.length(1)
                            .and.to.include('bar');
  });

});
