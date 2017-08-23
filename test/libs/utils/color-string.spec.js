'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect

// Load our module
const utils = require('../../../app/lib/utils');

// Formats a string with ANSI styling
describe('Function "colorString"', () => {

  it('should export a function', () => {
    expect(utils.colorString).to.be.a('Function');
  });

  it('should return a string', () => {
    const colorStringResult = utils.colorString('');
    expect(colorStringResult).to.be.a('string');
  });

  it('should color the word "Red" \u001b[31mred\u001b[39m', () => {
    const colorStringResult = utils.colorString('Default {red:Red}');
    expect(colorStringResult).to.equal('Default \u001b[31mRed\u001b[39m');
  });

  it('should allow chaining of \u001b[45m\u001b[97mstyles\u001b[39m\u001b[49m', () => {
    const colorStringResult = utils.colorString('Default {whiteBright,bgMagenta:White on Magenta}');
    expect(colorStringResult).to.equal('Default \u001b[45m\u001b[97mWhite on Magenta\u001b[39m\u001b[49m');
  });

  it('should allow the use of \u001b[4mmodifiers\u001b[24m', () => {
    const colorStringResult = utils.colorString('Default {underline:Underline}');
    expect(colorStringResult).to.equal('Default \u001b[4mUnderline\u001b[24m');
  });

  it('should allow the use of \u001b[36mnested \u001b[4moptions\u001b[39m\u001b[24m', () => {
    const colorStringResult = utils.colorString('Default {cyan:Cyan & {underline:Underlined}}');
    expect(colorStringResult).to.equal('Default \u001b[36mCyan & \u001b[4mUnderlined\u001b[39m\u001b[24m');
  });

  it('should return a blank string when passed an invalid input type', () => {
    const colorStringResult = utils.colorString({});
    expect(colorStringResult).to.equal('');
  });

  it('should ignore invalid color choices', () => {
    const colorStringResult = utils.colorString('Default {skyblue:Skyblue}');
    expect(colorStringResult).to.equal('Default Skyblue');
  });

  it('should attempt to remove an invalid pattern', () => {
    const colorStringResult = utils.colorString('Default {red:Unfinished');
    expect(colorStringResult).to.equal('Default Unfinished');
  });
});
