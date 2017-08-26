'use strict';

// Load requirements
const path = require('path');

// Load chai
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

// Load our module
const task = require('../../../app/libs/task');

// Define the test data directory
let directory = path.resolve('./test/data/task/validate');

describe('Function "create"', () => {

  it('should export a function', () => {
    expect(task.create).to.be.a('function');
  });

  it('should return a promise', () => {
    expect(task.create()).to.eventually.be.rejected;
  });

  it('should reject when called with an invalid schema', (done) => {

    let file = path.join(directory, 'object.invalid.json');

    task.create(require(file)).then((result) => {
      return done(false);
    }).catch((err) => {

      expect(err).to.be.an('array')
                 .to.have.nested.property('[0]')
                 .and.to.match(/should be >= 0/ig);

      return done();
    });
  });

  it('should throw an exception with no data argument', (done) => {
    
    task.create().then((result) => {
      return done(false);
    }).catch((err) => {

      expect(err).to.be.an('array')
                 .to.have.nested.property('[0]')
                 .and.to.match(/No data provided/ig);

      return done();
    });
  });

  it('should resolve when given a valid schema', () => {

    let file = path.join(directory, 'object.valid.json');

    let taskResult = task.create(require(file));

    expect(taskResult).to.eventually.be.fulfilled;
  });

  it('should assign valid data to the returned object', (done) => {

    let schema = require(path.join(directory, 'object.valid.json'));

    schema.directory = path.resolve('./test/data/task/listing');

    task.create(schema).then((result) => {

      expect(result).to.be.an('object')
                    .with.all.keys(['data', 'files']);

      expect(result).to.have.nested.property('data')
                    .to.be.an('object')
                    .with.all.keys(['name', 'directory', 'type', 'seasons', 'options']);

      expect(result).to.have.nested.property('files')
                    .to.be.an('array');

      return done();
    }).catch((err) => {
      return done(err);
    });
  });

  it('should return an array of objects containing files to be processed', (done) => {
    
    let schema = require(path.join(directory, 'object.valid.json'));

    schema.directory = path.resolve('./test/data/task/listing');

    task.create(schema).then((result) => {

      expect(result).to.have.nested.property('files')
                    .to.be.an('array')
                    .to.have.nested.property('[0].files')
                    .with.length(2);

      return done();
    }).catch((err) => {
      console.log(err);
      return done(err);
    });
  });

  it('should be rejected with an invalid directory path', (done) => {

    let file = path.join(directory, 'object.valid.json');

    task.create(require(file)).then((result) => {
      return done(false);
    }).catch((err) => {

      expect(err).to.be.a('string')
                 .and.to.match(/invalid directory/ig);

      return done();
    });
  });

});
