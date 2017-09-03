'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const format = __require('libs/task/format');

// Describe the module
describe('Function "remove"', () => {

  beforeEach(() => { format.reset(); });

  afterEach(() => { format.reset(); });

  it('should export a function', () => {
    expect(format.remove).to.be.a('function');
  });

  it('should remove a single item', () => {

    let removeResult = format.remove('mkv');

    expect(removeResult).to.be.true;
    expect(format.formats).to.not.include('mkv');
  });

  it('should remove multiple formats when given an array', () => {

    let removeResult = format.remove(['mkv', 'mp4']);

    expect(removeResult).to.be.true;
    expect(format.formats).to.not.include.members(['mkv', 'mp4']);
  });

  it('should update the regex pattern on change', () => {

    let removeResult = format.remove('mkv');

    expect(removeResult).to.be.true;

    let matchResult = 'test file.mkv'.match(format.pattern);

    expect(matchResult).to.be.null;
  });

  it('should still be successful when passing a missing format', () => {

    let removeResult = format.remove('foo');

    expect(removeResult).to.be.true;
  });

  it('should handle an invalid or no argument given', () => {

    let removeResult = format.remove();

    expect(removeResult).to.be.false;
  });

});
