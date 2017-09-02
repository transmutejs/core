'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs');

// Load chai
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

// Load our module
const utils = __require('libs/utils');

// Create a copy of a file
const source = path.resolve('./test/data/task/metadata/Castle.S01E01.mp4'),
      dest = path.resolve('./test/data/task/metadata/Castle.S01E02.mp4');

// Moves a file and tracks progress on the CLI
describe('Function "move"', () => {

  after(() => {
    if ( fs.existsSync(dest) ) {
      fs.unlinkSync(dest);
    }
  });

  it('should export a function', () => {
    expect(utils.move).to.be.a('function');
  });

  it('should return a promise', () => {

    let moveResult = utils.move();

    return expect(moveResult).to.be.a('promise')
                             .and.to.eventually.be.rejected;
  });

  it('should reject without a source', () => {

    let moveResult = utils.move(undefined, dest);

    return expect(moveResult).to.be.a('promise')
                             .and.to.eventually.be.rejected;
  });

  it('should reject without a dest', () => {

    let moveResult = utils.move(source, undefined);

    return expect(moveResult).to.be.a('promise')
                             .and.to.eventually.be.rejected;
  });

  it('should fulfill if source and dest are the same', () => {

    let moveResult = utils.move(source, source);

    return expect(moveResult).to.be.a('promise')
                             .and.to.eventually.be.fulfilled;
  });

  it('should reject without a valid source', () => {

    let moveResult = utils.move(dest, '/tmp');

    return expect(moveResult).to.be.a('promise')
                             .and.to.eventually.be.rejected;
  });

});
