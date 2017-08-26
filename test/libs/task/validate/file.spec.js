'use strict';

// Load requirements
const path = require('path');

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const validate = require('../../../../app/libs/task/validate');

// Define the test data directory
let directory = path.resolve('./test/data/task/validate');

// Describe the module
describe('Function "file"', () => {

  it('should export a function', () => {
    expect(validate.file).to.be.a('function');
  });

  it('should return an object with status and error properties', () => {

    let fileResult = validate.file();

    expect(fileResult).to.be.an('object')
                      .with.all.keys(['status', 'errors'])
                      .and.ownProperty('status').to.be.false;
  });

  it('should return status true with a valid schema', () => {

    let file = path.join(directory, 'file.valid.json');

    let fileResult = validate.file(require(file));

    expect(fileResult).to.be.an('object')
                      .with.all.keys(['status', 'errors'])
                      .and.ownProperty('status').to.be.true;
  });

  it('should return status false and an error message with an invalid schema', () => {

    let file = path.join(directory, 'file.invalid.json');

    let fileResult = validate.file(require(file));

    expect(fileResult).to.be.an('object')
                      .with.ownProperty('errors').to.be.an('array')
                      .and.deep.include.members([{path: '.tasks[0].seasons[2]', message: 'should be number'}]);
  });

});
