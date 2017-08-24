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

  it('should add x items to the queue', () => {

  });

  it('should increase the total queue length', () => {

  });

  it('should handle an empty or missing directory', () => {

  });

  it('should cache items as they are added to queue', () => {

  });

  it('should not duplicate queue items', () => {

  });

  it('should throw an error when passed an invalid file', () => {

  });

  

});
