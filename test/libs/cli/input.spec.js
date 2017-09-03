'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

// Load our module
const cli = __require('libs/cli');

// Describe the module
describe('Function "input"', () => {

  it('should export a function', () => {
    expect(cli.input).to.be.a('function');
  });

});
