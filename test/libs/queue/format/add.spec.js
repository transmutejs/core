'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const format = require('../../../../app/lib/queue/format');

// Describe the module
describe('Function "add"', () => {

  afterEach(() => { format.reset(); });

  it('should export a function', () => {
    expect(format.add).to.be.a('function');
  });

  it('should add a single new item', () => {

    let addResult = format.add('foo');

    expect(addResult).to.be.true;
    expect(format.formats).to.include('foo');
  });

  it('should add multiple formats when given an array', () => {

    let addResult = format.add(['foo', 'bar']);

    expect(addResult).to.be.true;
    expect(format.formats).to.include.members(['foo', 'bar']);
  });

  it('should update the regex pattern on change', () => {

    let addResult = format.add('foo');

    expect(addResult).to.be.true;

    let matchResult = 'test file.foo'.match(format.pattern);

    expect(matchResult).to.not.be.null;
  });

  it('should still be successful when passing an existing format', () => {

    let addResult = format.add('mkv');

    expect(addResult).to.be.true;
  });

  it('should handle an invalid or no argument given', () => {

    let addResult = format.add();

    expect(addResult).to.be.false;
  });

});
