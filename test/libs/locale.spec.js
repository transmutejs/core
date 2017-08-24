'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const i18n = require('../../app/lib/locale');

// Describe the module
describe('Locale module', () => {

  it('should export an object', () => {
    expect(i18n).to.be.an('object');
  });

  it('should add "lang" function to the global space', () => {
    expect(lang).to.be.a('function');
  });

  it('should add "plural" function to the global space', () => {
    expect(plural).to.be.a('function');
  });

  it('should default to the locale specified in env', () => {
    expect(i18n.getLocale()).to.be.a('string')
                            .that.equals( process.env.LOCALE || 'en' );
  });

  it('should allow changing of the localization', () => {

    i18n.setLocale('de');
    
    expect(i18n.getLocale()).to.be.a('string')
                            .that.equals('de');

    i18n.setLocale( process.env.LOCALE || 'en' );
  });

});
