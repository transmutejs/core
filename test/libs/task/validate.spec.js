'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const TaskModule = require('../../../app/libs/task');
const task = new TaskModule();

describe('Class "validate"', () => {

  it('should export an object', () => {
    expect(task.validate).to.be.an('object');
  });

});
