'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const utils = require('../../../app/libs/utils');

describe('Function "camelCase"', () => {

  it('should export a function', () => {
    expect(utils.camelCase).to.be.a('function');
  });

  it('should return a string', () => {

  	let ccResult = utils.camelCase('');

  	expect(ccResult).to.be.a('string');
  });

  it('should convert a hypenated string to the correct format', () => {

  	let ccResult = utils.camelCase('foo-bar');

  	expect(ccResult).to.be.a('string')
  					.and.to.equal('fooBar');
  });

  it('should correctly handle a hypenated string with numbers', () => {

    let ccResult = utils.camelCase('foo-9bar');

    expect(ccResult).to.be.a('string')
                    .and.to.equal('foo9bar');
  });

  it('should return the passed argument if not a string', () => {

  	let ccResult = utils.camelCase({});

  	expect(ccResult).to.be.an('object');
  });

});
