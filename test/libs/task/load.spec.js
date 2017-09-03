'use strict';

// Load requirements
const path = require('path');

// Load chai
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

// Load our module
const task = __require('libs/task');

// Define files to use
const validFile = '../test/data/task/validate/file.valid.json',
      invalidFile = '../test/data/task/validate/file.invalid.json',
      badJsonFile = '../test/data/task/validate/file.badjson.json';

// Creates a pseudo unique string of a given length
describe('Function "load"', () => {

  it('should export a function', () => {
    expect(task.load).to.be.a('function');
  });

  it('should return a promise', () => {

    let loadResult = task.load();

    return expect(loadResult).to.be.a('promise')
                             .and.to.eventually.be.rejected;
  });

  it('should reject when given an invalid path or directory', () => {

    let loadResult = task.load('../test/data/task/validate/');

    return expect(loadResult).to.be.a('promise')
                             .to.eventually.match(/does not exist/ig)
                             .and.be.rejected;
  });

  it('should reject when given an invalid file', () => {

    let loadResult = task.load(path.resolve(invalidFile));

    return expect(loadResult).to.be.a('promise')
                             .to.eventually.match(/error/ig)
                             .and.be.rejected;
  });

  it('should resolve the file path if only given a partial one', () => {

    let loadResult = task.load(invalidFile);

    return expect(loadResult).to.be.a('promise')
                             .and.to.eventually.be.an('array')
                             .with.length(1)
                             .and.be.rejected;
  });

  it('should reject when given an invalid json file', () => {

    let loadResult = task.load(badJsonFile);

    return expect(loadResult).to.be.a('promise')
                             .to.eventually.match(/bad json/ig)
                             .and.be.rejected;
  });

  it('should resolve with a list of tasks and jobs', () => {

    let loadResult = task.load(validFile);

    return expect(loadResult).to.be.a('promise')
                             .and.to.eventually.be.an('array')
                             .with.length(0)
                             .and.be.fulfilled;
  });

});
