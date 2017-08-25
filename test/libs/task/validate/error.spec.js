'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const validate = require('../../../../app/libs/task/validate');

// Describe the module
describe('Function "error"', () => {

  it('should export a function', () => {
    expect(validate.error).to.be.a('function');
  });

});
