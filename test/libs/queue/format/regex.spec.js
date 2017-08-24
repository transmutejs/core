'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const format = require('../../../../app/lib/queue/format');

// Describe the module
describe('Function "regex"', () => {

  beforeEach(() => { format.reset(); });

  afterEach(() => { format.reset(); });

  it('should export a function', () => {
    expect(format.regex).to.be.a('function');
  });

  it('should update the pattern property', () => {

    let addResult = format.add('foo');

    expect(addResult).to.be.true;

    let matchResult = 'test file.foo'.match(format.pattern);

    expect(matchResult).to.not.be.null;
  });

  it('should handle regex unsafe characters', () => {

    let addResult = format.add('fo*o');

    expect(addResult).to.be.true;

    let matchResult = 'test file.fo*o'.match(format.pattern);

    expect(matchResult).to.not.be.null;
  });

});
