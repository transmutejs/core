'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const cache = __require('libs/job/cache');

// Describe the module
describe('Function "episodeKey"', () => {

  it('should export a function', () => {
    expect(cache.episodeKey).to.be.a('function');
  });

  it('should set season to 0 when undefined', () => {

    let episodeKeyResult = cache.episodeKey(undefined, 1);

    expect(episodeKeyResult).to.be.a('string').and.equal('S00E01');
  });

  it('should set episode to 0 when undefined', () => {

    let episodeKeyResult = cache.episodeKey(1, undefined);

    expect(episodeKeyResult).to.be.a('string').and.equal('S01E00');
  });

  it('should create a correctly formatted string', () => {

    let episodeKeyResult = cache.episodeKey(1, 1);

    expect(episodeKeyResult).to.be.a('string').and.equal('S01E01');
  });

  it('should handle arguments longer than 2 numbers', () => {

    let episodeKeyResult = cache.episodeKey(100, 1);

    expect(episodeKeyResult).to.be.a('string').and.equal('S100E01');
  });

});
