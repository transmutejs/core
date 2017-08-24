'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const queue = require('../../../app/lib/queue');

// Creates a pseudo unique string of a given length
describe('Class "format"', () => {

  it('should export an object', () => {
    expect(queue.format).to.be.an('object');
  });

});
