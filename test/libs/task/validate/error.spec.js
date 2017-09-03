'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const validate = __require('libs/task/validate');

// Describe the module
describe('Function "error"', () => {

  it('should export a function', () => {
    expect(validate.error).to.be.a('function');
  });

  it('should return an object with status and error properties', () => {

    let errorResult = validate.error([]);

    expect(errorResult).to.be.an('object')
                       .with.all.keys(['status', 'errors'])
                       .and.ownProperty('status').to.be.false;
  });

  it('should format an object into an array of error messages', () => {

    let errorResult = validate.error([{dataPath: 'foo', message: 'bar'}]);

    expect(errorResult).to.be.an('object')
                       .with.ownProperty('errors').to.be.an('array')
                       .and.deep.include.members([{path: 'foo', message: 'bar'}]);
  });

  it('should handle not being given a data path', () => {

    let errorResult = validate.error([{message: 'bar'}]);

    expect(errorResult).to.be.an('object')
                       .with.ownProperty('errors').to.be.an('array')
                       .and.deep.include.members([{path: '', message: 'bar'}]);
  });

  it('should handle not being given a message', () => {

    let errorResult = validate.error([{dataPath: 'foo'}]);

    expect(errorResult).to.be.an('object')
                       .with.ownProperty('errors').to.be.an('array')
                       .and.deep.include.members([{path: 'foo', message: ''}]);
  });

  it('should handle being given no or an invalid input', () => {

    let errorResult = validate.error();

    expect(errorResult).to.be.an('object')
                       .with.all.keys(['status', 'errors'])
                       .and.ownProperty('status').to.be.false;
  });

});
