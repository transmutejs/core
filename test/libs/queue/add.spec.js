'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

// Load our module
const queue = require('../../../app/libs/queue');

describe('Function "add"', () => {

  it('should export a function', () => {
    expect(queue.add).to.be.a('function');
  });

  it('should return a promise', () => {

    let addResult = queue.add();

    return expect(addResult).to.be.a('promise')
                            .and.to.eventually.be.rejected;
  });

  it('should resolve when passed a task class', () => {

    let addResult = queue.add(function() { return true; });

    return expect(addResult).to.eventually.be.fulfilled;
  });

  it('should add x items to the queue', () => {

  });

  it('should increase the total queue length', () => {

  });

  it('should cache items as they are added to queue', () => {

  });

  it('should not duplicate queue items', () => {

  });

  it('should send a rejection when passed an invalid task argument', () => {

    let addResult = queue.add('foo bar');

    return expect(addResult).to.eventually.be.rejected;
  });

  it('should send a rejection when passed no arguments', () => {

    let addResult = queue.add();

    return expect(addResult).to.eventually.be.rejected;
  });

});
