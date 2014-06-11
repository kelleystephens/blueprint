/* global describe, before, beforeEach, it */

'use strict';

process.env.DBNAME = 'blueprint-test';

var expect = require('chai').expect;
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');
var app = require('../../../app/app');
var request = require('supertest');

var Location;

describe('locations', function(){

  before(function(done){
    db(function(){
      Location = traceur.require(__dirname + '/../../../app/models/location.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('locations').drop(function(){

      factory('location', function(locations){
        done();
      });
    });
  });

  describe('GET /locations/new', function(){
    it('should get the new locations web page', function(done){
      request(app)
      .get('/locations/new')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('POST /locations', function(){
    it('should save a new location and redirect', function(done){
      request(app)
      .post('/locations')
      .send('name=mountains')
      .send('rate=55')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/locations');
        done();
      });
    });
  });

  describe('GET /locations', function(){
    it('should display all locations', function(done){
      request(app)
      .get('/locations')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('<li>Mountain</li><li>Lake</li><li>Ocean</li><li>Valley</li><li>Manhattan</li>');
        done();
      });
    });
  });

});
