'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

// Load our module
const metadata = require('../../../app/libs/details/metadata');

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

});
