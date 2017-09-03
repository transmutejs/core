'use strict';

// Load requirements
const progress = require('progress');

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const utils = __require('libs/utils');

// Returns a standardised instance of a progress bar for CLI
describe('Function "progressBar"', () => {

  it('should export a function', () => {
    expect(utils.progressBar).to.be.a('function');
  });

  it('should return an instance of ProgressBar', () => {

    let progressBarResult = utils.progressBar();

    expect(progressBarResult).to.be.an.instanceOf(progress);
  });

  it('should have the expected methods', () => {

    let progressBarResult = utils.progressBar();

    expect(progressBarResult).to.be.an('object')
                             .to.respondTo('update')
                             .respondTo('terminate')
                             .respondTo('render')
                             .respondTo('interrupt')
                             .and.respondTo('tick');
  });

});
