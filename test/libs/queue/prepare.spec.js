'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

// Load our module
const queue = require('../../../app/lib/queue');

describe('Function "prepare"', () => {

  it('should export a function', () => {
    expect(queue.add).to.be.a('function');
  });

  it('should return a promise', () => {

    let prepareResult = queue.prepare();

    expect(prepareResult).to.be.a('promise');
  }); 

});
