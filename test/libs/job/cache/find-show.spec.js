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
const cacheDir = path.join(settings.directory, 'cache');

// Describe the module
describe('Function "findShow"', () => {

  it('should export a function', () => {
    expect(cache.findShow).to.be.a('function');
  });

  it('should return false when given a non-existent show', () => {

    let findShowResult = cache.findShow();

    expect(findShowResult).to.be.false;
  });

  it('should be false if the file contains bad JSON', () => {

    // Build filename
    let file = path.join(cacheDir, 'test.json');
    fs.writeFileSync(file, '{');

    let findShowResult = cache.findShow('test');

    expect(findShowResult).to.be.false;

    fs.unlinkSync(file);
  });

  it('should be false if the file contains bad JSON', () => {

    // Build filename
    let file = path.join(cacheDir, 'test.json');
    fs.writeFileSync(file, JSON.stringify({name: 'test'}, null, 4));

    let findShowResult = cache.findShow('test');

    expect(findShowResult).to.be.an('object')
                          .and.to.include.keys('name');

    fs.unlinkSync(file);
  });

});
