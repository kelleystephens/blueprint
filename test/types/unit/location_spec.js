/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'blueprint-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');

var Location;

describe('User', function(){
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

  describe('.create', function(){
    it('should create a location', function(done){
      Location.create({name:'Mars', rate:'3.33'}, function(loc){
        expect(loc).to.be.instanceof(Location);
        expect(loc._id).to.be.instanceof(Mongo.ObjectID);
        expect(loc.name).to.equal('Mars');
        expect(loc.rate).to.be.within(3.2, 3.4);
        done();
      });
    });
  });

  describe('.findAll', function(){
    it('should find locations', function(done){
      Location.findAll(function(locations){
        expect(locations).to.have.length(5);
        expect(locations[0]).to.be.instanceof(Location);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a location', function(done){
      Location.findById('a123456789abcdef01234567', function(location){
        expect(location).to.be.instanceof(Location);
        expect(location.name).to.equal('Mountain');
        done();
      });
    });
  });

});
