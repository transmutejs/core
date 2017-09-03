'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs');

// Load chai
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

// Load our module
const task = __require('libs/task');

// Define the test data directory
let directory = path.resolve('./test/data/task/listing');

describe('Function "listing"', () => {

  it('should export a function', () => {
    expect(task.listing).to.be.a('function');
  });

  it('should return a promise', () => {

    let listingResult = task.listing();

    return expect(listingResult).to.be.a('promise')
                                .and.to.eventually.be.rejected;
  });

  it('should be rejected with no input', () => {
    
    let listingResult = task.listing();
    
    return expect(listingResult).to.be.rejected;
  });

  it('should return an array with a single item if given a file path', () => {

    let file = path.join(directory, 'valid file.mp4');

    let listingResult = task.listing(file);

    return expect(listingResult).to.eventually.be.an('array')
                                .and.to.have.nested.property('[0].files[0]', file);
  });

  it('should produce an array of files in a directory', () => {

    let listingResult = task.listing(directory);

    return expect(listingResult).to.eventually.be.an('array')
                                .to.have.nested.property('[0].files')
                                .with.length(2);
  });

  it('should only return files in the specified formats', (done) => {
    
    task.listing(directory).then((result) => {

      expect(result).to.be.an('array');

      result[0].files.forEach((file) => {
        expect(file).to.be.a('string')
                    .and.to.match(task.format.pattern);
      });

      return done();
    }).catch((err) => {
      return done(err);
    });
  });

  it('should produce an array of objects when given seasons', (done) => {

    task.listing(directory, [1, 2]).then((result) => {

      expect(result).to.be.an('array');

      result.forEach((season) => {

        expect(season).to.have.all.keys(['season', 'files'])
                      .and.property('files').not.be.empty;

        expect(season.season).to.be.a('string')
                             .and.to.match(/[1|2]/);

        season.files.forEach((file) => {
          expect(file).to.be.a('string')
                      .and.to.match(task.format.pattern);
        });

      });

      return done();
    }).catch((err) => {
      return done(err);
    });
  });

  it('should reject when an invalid file format is provided', () => {
    
    let file = path.join(directory, 'invalid file.ext');

    let listingResult = task.listing(file);
    
    return expect(listingResult).to.be.rejected;
  });

  it('should return an empty array when an empty directory is provided', (done) => {

    let emptyDir = path.join(directory, 'Empty Directory');

    if ( ! fs.existsSync(emptyDir) ) {
      fs.mkdirSync(emptyDir);
    }

    let listingResult = task.listing(emptyDir);

    expect(listingResult).to.eventually.be.an('array')
                         .to.have.nested.property('[0].files')
                         .and.be.empty
                         .notify(done);

    if ( fs.existsSync(emptyDir) ) {
      fs.rmdirSync(emptyDir);
    }
  });

  it('should reject when an invalid season is provided', () => {
    
    let listingResult = task.listing(directory, ['not-a-valid-season']);
    
    return expect(listingResult).to.be.rejected;
  });

  it('should reject when an invalid directory is provided', () => {

    let file = path.join(directory, 'not-a-valid-directory');

    let listingResult = task.listing(file);

    return expect(listingResult).to.be.rejected;
  });

});
