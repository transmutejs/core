'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs');

// Variables
let loggerDir = path.resolve('./logs');

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load sinon
const sinon = require('sinon');
chai.use(require('sinon-chai'));

// Load our module
const logger = __require('libs/log');

// Describe the module
describe('Log module', () => {

  it('should export an object', () => {
    expect(logger).to.be.an('object');
  });

  it('should create the log folder', () => {

    let exists = fs.existsSync(loggerDir);

    expect(exists).to.be.true;
  });

  it('should output a string to the console', () => {

    let spy = sinon.spy(logger, 'log');

    logger.verbose('foo bar');

    expect(spy).to.have.been.calledOnce;

    spy.restore();
  });

  it('should colorize a string before outputting it', () => {

    let loggerResult = logger.filters[0]('verbose', 'foo {red:bar}');
    
    expect(loggerResult).to.equal('foo \u001b[31mbar\u001b[39m');
  });

  it('should export 6 helper functions', () => {

    let methods = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];

    methods.forEach((method) => {
      expect(logger[method]).to.be.a('function');
    });
    
  });

});
