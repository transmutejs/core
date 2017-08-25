'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const format = require('../../../../app/libs/task/format');

// Describe the module
describe('Function "clear"', () => {

  beforeEach(() => { format.reset(); });

  afterEach(() => { format.reset(); });

  it('should export a function', () => {
    expect(format.clear).to.be.a('function');
  });

  it('should remove all items', () => {

    let clearResult = format.clear();

    expect(clearResult).to.be.true;
    expect(format.formats).to.be.empty;
  });

  it('should update the regex pattern on change to allow any format', () => {

    let clearResult = format.clear();

    expect(clearResult).to.be.true;

    let matchResult = 'test file.foo'.match(format.pattern);

    expect(matchResult).to.not.be.null;
  });

});
