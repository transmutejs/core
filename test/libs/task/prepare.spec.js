'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const TaskModule = require('../../../app/libs/task');
const task = new TaskModule();

describe('Function "prepare"', () => {

  it('should export a function', () => {
    expect(task.prepare).to.be.a('function');
  });

});
