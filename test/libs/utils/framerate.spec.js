'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const utils = __require('libs/utils');

// Calculates the framerate for a video file
describe('Function "framerate"', () => {

  it('should export a function', () => {
    expect(utils.framerate).to.be.a('function');
  });

  it('should return a number', () => {

    let framerateResult = utils.framerate();

    expect(framerateResult).to.be.a('number')
                           .and.to.equal(0);
  });

  it('should correctly perform math on a division', () => {

    let framerateResult = utils.framerate('10 / 2');

    expect(framerateResult).to.be.a('number')
                           .and.to.equal(5);
  });

  it('should correctly perform math on a mulitplier', () => {

    let framerateResult = utils.framerate('10 * 2');

    expect(framerateResult).to.be.a('number')
                           .and.to.equal(20);
  });

  it('should correctly perform math on a plus', () => {

    let framerateResult = utils.framerate('10 + 2');

    expect(framerateResult).to.be.a('number')
                           .and.to.equal(12);
  });

  it('should correctly perform math on a minus', () => {

    let framerateResult = utils.framerate('10 - 2');

    expect(framerateResult).to.be.a('number')
                           .and.to.equal(8);
  });

  it('should handle decimals as input', () => {

    let framerateResult = utils.framerate('.5 * 4');

    expect(framerateResult).to.be.a('number')
                           .and.to.equal(2);
  });

  it('should handle decimals as output', () => {

    let framerateResult = utils.framerate('30000 / 1001');

    expect(framerateResult).to.be.a('number')
                           .and.to.equal(29.97002997002997);
  });

  it('should return a number when input', () => {

    let framerateResult = utils.framerate('10.34');

    expect(framerateResult).to.be.a('number')
                           .and.to.equal(10.34);
  });

  it('should return zero for an invalid input', () => {

    let framerateResult = utils.framerate('foobar');

    expect(framerateResult).to.be.a('number')
                           .and.to.equal(0);
  });

});
