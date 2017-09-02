'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const utils = __require('libs/utils');

// Checks if a command is available in cmd/terminal
describe('Function "commandExists"', () => {

  it('should export a function', () => {
    expect(utils.commandExists).to.be.a('function');
  });

  it('should return a boolean', () => {

    let commandExistsResult = utils.commandExists();

    expect(commandExistsResult).to.be.a('boolean');
  });

  it('should correctly find ffmpeg', () => {

    let commandExistsResult = utils.commandExists('ffmpeg');

    expect(commandExistsResult).to.be.a('boolean')
                               .and.to.equal(true);
  });

  it('should correctly find ffprobe', () => {

    let commandExistsResult = utils.commandExists('ffprobe');

    expect(commandExistsResult).to.be.a('boolean')
                               .and.to.equal(true);
  });

  it('should not find an invalid command', () => {

    let commandExistsResult = utils.commandExists('not-really-a-cmd');

    expect(commandExistsResult).to.be.a('boolean')
                               .and.to.equal(false);
  });

});
