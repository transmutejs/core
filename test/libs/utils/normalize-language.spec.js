'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const utils = __require('libs/utils');

// Normalizes a language from 2 or 3 character iso standard to full length
describe('Function "normalizeLanguage"', () => {

  it('should export a function', () => {
    expect(utils.normalizeLanguage).to.be.a('function');
  });

  it('should return a string', () => {

    let langResult = utils.normalizeLanguage('en');

    expect(langResult).to.be.a('string');
  });

  it('should correctly format a 2 letter language code', () => {

    let langResult = utils.normalizeLanguage('vi');

    expect(langResult).to.be.a('string')
                      .and.to.equal('Vietnamese');
  });

  it('should correctly format a 3 letter language code', () => {

    let langResult = utils.normalizeLanguage('jpn');

    expect(langResult).to.be.a('string')
                      .and.to.equal('Japanese');
  });

  it('should return unknown for an invalid 2 character code', () => {

    let langResult = utils.normalizeLanguage('fb');

    expect(langResult).to.be.a('string')
                      .and.to.equal('Unknown');
  });

  it('should return unknown for an invalid 3 character code', () => {

    let langResult = utils.normalizeLanguage('foo');

    expect(langResult).to.be.a('string')
                      .and.to.equal('Unknown');
  });

  it('should return unknown for a missing input', () => {

    let langResult = utils.normalizeLanguage();

    expect(langResult).to.be.a('string')
                      .and.to.equal('Unknown');
  });

  it('should capitalize strings longer than 3 characters', () => {

    let langResult = utils.normalizeLanguage('klingon');

    expect(langResult).to.be.a('string')
                      .and.to.equal('Klingon');
  });

  it('should return a capitalized single character', () => {

    let langResult = utils.normalizeLanguage('u');

    expect(langResult).to.be.a('string')
                      .and.to.equal('U');
  });

});
