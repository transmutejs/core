'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const format = __require('libs/task/format');

// Describe the module
describe('Function "reset"', () => {

  it('should export a function', () => {
    expect(format.reset).to.be.a('function');
  });

  it('should reset the available formats', () => {

    let defaultFormats = format.formats.slice(0);

    let addResult = format.add('foo');

    expect(addResult).to.be.true;

    expect(format.formats).to.have.length.above(defaultFormats.length);

    format.reset();

    expect(format.formats).to.eql(defaultFormats);
  });

  it('should update the regex pattern on reset', () => {

    let addResult = format.add('foo');

    expect(addResult).to.be.true;

    format.reset();

    let matchResult = 'test file.foo'.match(format.pattern);

    expect(matchResult).to.be.null;
  });

});
