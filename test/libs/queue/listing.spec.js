'use strict';

// Load requirements
const path = require('path');

// Load chai
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

// Load our module
const queue = require('../../../app/lib/queue');

// Define the test data directory
let directory = path.resolve('./test/data/queue');

describe('Function "listing"', () => {

  it('should export a function', () => {
    expect(queue.listing).to.be.a('function');
  });

  it('should return a promise', () => {

    let listingResult = queue.listing();

    expect(listingResult).to.be.a('promise');
  });

  it('should be rejected with no input', () => {
    
    let listingResult = queue.listing();
    
    return expect(listingResult).to.be.rejected;
  });

  it('should return an array with a single item if given a file path', () => {

    let file = path.join(directory, 'valid file.mp4');

    let listingResult = queue.listing(file);

    return expect(listingResult).to.eventually.be.an('array')
                                .and.to.have.nested.property('[0].files[0]', file);
  });

  it('should produce an array of files in a directory', () => {

    let listingResult = queue.listing(directory);

    return expect(listingResult).to.eventually.be.an('array')
                                .to.have.nested.property('[0].files')
                                .with.length(2);
  });

  it('should only return files in the specified formats', () => {
    
    let listingResult = queue.listing(directory);

    return expect(listingResult).to.eventually.be.an('array')
                                .to.have.nested.property('[0].files[0]')
                                .and.match(queue.format.regex());
  });

  it('should produce an array of objects when given seasons', () => {

    let listingResult = queue.listing(directory, [1, 2]);

    return expect(listingResult).to.eventually.be.an('array')
                                .to.have.nested.property('[0].files[0]');
  });

  it('should reject when an invalid season is provided', () => {
    
    let listingResult = queue.listing(directory, ['not-a-valid-season-i-hope']);
    
    return expect(listingResult).to.be.rejected;
  });

  it('should reject when an invalid directory is provided', () => {

    let file = path.join(directory, 'not-a-valid-directory-i-hope');
    
    let listingResult = queue.listing(file);
    
    return expect(listingResult).to.be.rejected;
  });

});
