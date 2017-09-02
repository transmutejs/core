'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const utils = __require('libs/utils');

// Creates an instance of restify and socket.io
describe('Function "server"', () => {

  it('should export a function', () => {
    expect(utils.server).to.be.a('function');
  });

});
