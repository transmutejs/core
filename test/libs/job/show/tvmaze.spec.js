'use strict';

// Load requirements
const path = require('path'),
      fs = require('fs');

// Load chai
const chai = require('chai');
const expect = chai.expect;

// Load module
const tvmaze = __require('libs/job/show/tvmaze');

describe('Class "tvmaze"', () => {

  it('should export a function', () => {
    expect(tvmaze).to.be.a('function');
  });

  describe('Function "findShow"', () => {

    it('should export a function', () => {

      let tvmazeInst = tvmaze();

      expect(tvmazeInst.findShow).to.be.a('function');
    });

    it('should return a promise', () => {

      let tvmazeInst = tvmaze();

      let findShowResult = tvmazeInst.findShow();

      return expect(findShowResult).to.be.a('promise')
                                   .and.to.eventually.be.rejected;
    });

    it('should reject if the show was not found', (done) => {

      let tvmazeInst = tvmaze();

      tvmazeInst.findShow('not-a-real-show').then((result) => {
        return done(false);
      }).catch((err) => {
        expect(err).to.be.a('string').and.to.match(/no results/ig);
        return done();
      });
    });

  });

  describe('Function "findEpisode"', () => {

    it('should export a function', () => {

      let tvmazeInst = tvmaze();

      expect(tvmazeInst.findEpisode).to.be.a('function');
    });

    it('should return a promise', () => {

      let tvmazeInst = tvmaze();

      let findEpisodeResult = tvmazeInst.findEpisode();

      return expect(findEpisodeResult).to.be.a('promise')
                                      .and.to.eventually.be.rejected;
    });

    it('should resolve with a episode data', (done) => {
      
      let tvmazeInst = tvmaze();

      tvmazeInst.findShow('The Simpsons').then((show) => {
        return tvmazeInst.findEpisode(show.name, 1, 1);
      }).then((episode) => {
        expect(episode).to.be.an('object');
        return done();
      }).catch((err) => {
        return done(err);
      });
    });

    it('should reject if given an invalid show', (done) => {
      
      let tvmazeInst = tvmaze();

      tvmazeInst.findEpisode(undefined, 1, 1).then((episode) => {
        return done(false);
      }).catch((err) => {
        expect(err).to.be.a('string').and.to.match(/invalid data/ig);
        return done();
      });
    });

    it('should reject when given an invalid season or episode', (done) => {

      let tvmazeInst = tvmaze();

      tvmazeInst.findShow('The Simpsons').then((show) => {
        return tvmazeInst.findEpisode(show.name, 99, 1);
      }).then((episode) => {
        return done(false);
      }).catch((err) => {
        expect(err).to.be.a('string').and.to.match(/no results/ig);
        return done();
      });
    });

  });

});
