'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const validate = require('../../../../app/libs/task/validate');

// Describe the module
describe('Function "file"', () => {

  it('should export a function', () => {
    expect(validate.file).to.be.a('function');
  });

});
