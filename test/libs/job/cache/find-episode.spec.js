'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs');

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const cache = __require('libs/job/cache'),
      settings = __require('libs/settings');

// Variables
const cacheDir = path.join(settings.directory, 'cache'),
      testShow = path.join(cacheDir, 'test.json');

// Describe the module
describe('Function "findEpisode"', () => {

  before(() => {
    let source = require(path.resolve('./test/data/job/test.json'));
    fs.writeFileSync(testShow, JSON.stringify(source, null, 4));
  });

  after(() => {
    fs.unlinkSync(testShow);
  });

  it('should export a function', () => {
    expect(cache.findEpisode).to.be.a('function');
  });

  it('should return false with an invalid show', () => {

    let findEpisodeResult = cache.findEpisode();

    expect(findEpisodeResult).to.be.false;
  });

  it('should return false with an invalid episode', () => {

    let findEpisodeResult = cache.findEpisode('test', 100, 0);

    expect(findEpisodeResult).to.be.false;
  });

  it('should return an object with episode and show data', () => {

    let properties = ['id', 'name', 'date', 'episode', 'season', 'rating', 'description', 'background', 'show'];

    let findEpisodeResult = cache.findEpisode('test', 1, 1);

    expect(findEpisodeResult).to.be.an('object')
                             .and.have.all.keys(properties);
  });

});
