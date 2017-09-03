'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs');

// Load chai
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

// Load our module
const metadata = __require('libs/job/metadata');

describe('Class "metadata"', () => {

  it('should export an object', () => {
    expect(metadata).to.be.an('object');
  });

  describe('Function "get"', () => {

    it('should export a function', () => {
      expect(metadata.get).to.be.a('function');
    });

    it('should return a promise', () => {

      let metadataResult = metadata.get();

      return expect(metadataResult).to.be.a('promise')
                                   .and.to.eventually.be.rejected;
    });

    it('should send a rejection when passed no arguments', () => {

      let metadataResult = metadata.get();

      return expect(metadataResult).to.eventually.be.rejected;
    });

  });

  describe('Function "error"', () => {

    it('should export a function', () => {
      expect(metadata.error).to.be.a('function');
    });

    it('should return an array', () => {

      let errorResult = metadata.error('foo');

      expect(errorResult).to.be.an('array')
                         .with.length(1);
    });

    it('should extract a human readable error message from ffmpeg exception', () => {

      let file = path.resolve('./test/data/task/metadata/error.txt');
      let err = fs.readFileSync(file, 'utf8');

      let errorResult = metadata.error([err]);

      expect(errorResult).to.be.an('array')
                         .with.length(1)
                         .and.to.eql(['Invalid data found when processing input']);
    });

  });

});
