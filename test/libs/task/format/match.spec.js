'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const format = __require('libs/task/format');

// Describe the module
describe('Function "match"', () => {

  it('should export a function', () => {
    expect(format.match).to.be.a('function');
  });

  it('should match a valid file format', () => {

    let matchResult = format.match('valid file.mkv');

    expect(matchResult).to.be.true;
  });

  it('should reject an invalid file format', () => {

    let matchResult = format.match('invalid file.ext');

    expect(matchResult).to.be.false;
  });

  it('should handle an array of files to match', () => {

    let matchResult = format.match(['valid file 1.mkv', 'valid file 2.mp4']);

    expect(matchResult).to.be.true;
  });

  it('should reject an array on a single failure', () => {

    let matchResult = format.match(['valid file.mkv', 'invalid file.ext']);

    expect(matchResult).to.be.false;
  });

  it('should handle an invalid or no argument given', () => {

    let matchResult = format.match();

    expect(matchResult).to.be.false;
  });

});
