'use strict';

// Load requirements
const path = require('path');

// Load chai
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

// Load our module
const utils = __require('libs/utils');

describe('Function "metadata"', () => {

  it('should export a function', () => {
    expect(utils.metadata).to.be.a('function');
  });

  it('should return a promise', () => {

    let metadataResult = utils.metadata();

    return expect(metadataResult).to.be.a('promise')
                                 .and.to.eventually.be.rejected;
  });

  it('should resolve with an object', (done) => {

    let file = path.resolve('./test/data/task/metadata/Castle.S01E01.mp4');

    utils.metadata(file).then((result) => {
      expect(result).to.be.an('object');
      return done();
    }).catch((err) => {
      return done(err);
    });
  });

  it('should reject without a valid file argument', (done) => {

    utils.metadata().then((result) => {
      return done(false);
    }).catch((err) => {
      expect(err).to.match(/No file provided/ig);
      return done();
    });
  });

  it('should reject when given a non-existent file path', (done) => {

    let file = path.resolve('./not-a-real-file.mp4');

    utils.metadata(file).then((result) => {
      return done(false);
    }).catch((err) => {
      expect(err).to.match(/does not exist/ig);
      return done();
    });
  });

  it('should reject when given an invalid input file', (done) => {

    let file = path.resolve('./test/data/task/listing/invalid file.ext');

    utils.metadata(file).then((result) => {
      return done(false);
    }).catch((err) => {
      expect(err).to.match(/ffprobe exited with code 1/ig);
      return done();
    });
  });

});
