'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load our module
const cache = __require('libs/job/cache');

// Define tests to run
let tests = {
  "Foo bar": "foo-bar",
  "This is a test ---": "this-is-a-test",
  "This -- is a ## test ---": "this-is-a-test",
  "C'est déjà l'été.": "cest-deja-lete",
  "Nín hǎo. Wǒ shì zhōng guó rén": "nin-hao-wo-shi-zhong-guo-ren",
  "jaja---lol-méméméoo--a": "jaja-lol-mememeoo-a"
};

// Describe the module
describe('Function "normalize"', () => {

  it('should export a function', () => {
    expect(cache.normalize).to.be.a('function');
  });

  it('should return a string', () => {

    let normalizeResult = cache.normalize('');

    expect(normalizeResult).to.be.a('string').and.to.equal('');
  });

  Object.keys(tests).forEach((key) => {
    it('should change "' + key + '" to "' + tests[key] + '"', () => {

      let normalizeResult = cache.normalize(key);

      expect(normalizeResult).to.be.a('string').and.to.equal(tests[key]);
    });
  });

  it('should X', () => {

    let normalizeResult = cache.normalize(undefined);

    expect(normalizeResult).to.be.a('string').and.to.equal('');
  });

});
