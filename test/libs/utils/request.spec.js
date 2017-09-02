'use strict';

// Load chai
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));

// Load sinon to mock http
const sinon = require('sinon'),
      PassThrough = require('stream').PassThrough,
      http = require('http'),
      https = require('https');

// Load our module
const utils = __require('libs/utils');

// Creates a pseudo unique string of a given length
describe('Function "request"', () => {

  it('should export a function', () => {
    expect(utils.request).to.be.a('function');
  });

  it('should return a promise', () => {

    let requestResult = utils.request();

    return expect(requestResult).to.be.a('promise')
                                .and.to.eventually.be.rejected;
  });

  it('should send a rejection when passed no arguments', () => {

    let requestResult = utils.request();

    return expect(requestResult).to.eventually.be.rejected;
  });

  it('should use the http library when given a regular url', (done) => {

    let requestStub = sinon.stub(http, 'get');

    let response = new PassThrough();
    response.write('foobar');
    response.end();
   
    var request = new PassThrough();
   
    requestStub.callsArgWith(1, response)
               .returns(request);

    utils.request('http://insecuredomain.com').then((result) => {
      expect(result).to.equal('foobar');
      http.get.restore();
      done();
    }).catch((err) => {
      http.get.restore();
      done(err);
    });
  });

  it('should use the https library when given a secure url', (done) => {

    let requestStub = sinon.stub(https, 'get');

    let response = new PassThrough();
    response.write('foobar');
    response.end();
   
    var request = new PassThrough();
   
    requestStub.callsArgWith(1, response)
               .returns(request);

    utils.request('https://securedomain.com').then((result) => {
      expect(result).to.equal('foobar');
      https.get.restore();
      done();
    }).catch((err) => {
      https.get.restore();
      done(err);
    });
  });

  it('should reject when it encounters an error', (done) => {

    let requestStub = sinon.stub(http, 'get');

    let request = new PassThrough();
    requestStub.returns(request);

    utils.request('http://badurl.com').then((result) => {
      http.get.restore();
      done(false);
    }).catch((err) => {
      http.get.restore();
      expect(err).to.equal('error message');
      done();
    });
 
    request.emit('error', 'error message');
  });

  it('should reject when the status code isnt a 2xx', (done) => {

    let requestStub = sinon.stub(http, 'get');

    let response = new PassThrough();
    response.statusCode = 500;
    response.end();
   
    var request = new PassThrough();
   
    requestStub.callsArgWith(1, response)
               .returns(request);

    utils.request('http://serverissues.com').then((result) => {
      http.get.restore();
      done(false);
    }).catch((err) => {
      http.get.restore();
      expect(err).to.match(/Failed to load page/ig);
      done();
    });
  });

});
