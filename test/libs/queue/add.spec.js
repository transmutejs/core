'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

// Load our module
const queue = require('../../../app/lib/queue');

describe('Function "add"', () => {

  it('should export a function', () => {
    expect(queue.add).to.be.a('function');
  });

  it('should return a promise', () => {

    let addResult = queue.add();

    expect(addResult).to.be.a('promise');
  });

});
