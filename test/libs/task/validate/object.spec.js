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
describe('Function "object"', () => {

  it('should export a function', () => {
    expect(validate.object).to.be.a('function');
  });

  it('should return an object with status and error properties', () => {

    let objectResult = validate.object();

    expect(objectResult).to.be.an('object')
                        .with.all.keys(['status', 'errors'])
                        .and.ownProperty('status').to.be.false;
  });

  it('should return status true with a valid schema', () => {

    let file = path.join(directory, 'object.valid.json');

    let objectResult = validate.object(require(file));

    expect(objectResult).to.be.an('object')
                        .with.all.keys(['status', 'errors'])
                        .and.ownProperty('status').to.be.true;
  });

  it('should return status false and an error message with an invalid schema', () => {

    let object = path.join(directory, 'object.invalid.json');

    let objectResult = validate.object(require(object));

    expect(objectResult).to.be.an('object')
                        .with.ownProperty('errors').to.be.an('array')
                        .and.deep.include.members([{path: '.options.video.bitrate', message: 'should be >= 0'}]);
  });

});
