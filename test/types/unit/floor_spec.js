/* global describe, it, before, beforeEach, afterEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'blueprint-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');
var cp = require('child_process');
var fs = require('fs');

var Floor;

describe('Floor', function(){
  before(function(done){
    db(function(){
      Floor = traceur.require(__dirname + '/../../../app/models/floor.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('floors').drop(function(){
      cp.execFile(__dirname + '/../../fixtures/before.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
        factory('floor', function(floors){
          done();
        });
      });
    });
  });

  afterEach(function(done){
    cp.execFile(__dirname + '/../../fixtures/after.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('.create', function(){
    it('should create a floor - absolute photo path', function(done){
      var fields = {name:['tile'], rate:['4.35']};
      var files = {photo:[{originalFilename:'tile1-DELETE.png', path:__dirname + '/../../fixtures/copy/tile1-DELETE.png', size:10}]};
      fields.photo = files.photo;

      Floor.create(fields, function(floor){
        expect(floor).to.be.instanceof(Floor);
        expect(floor._id).to.be.instanceof(Mongo.ObjectID);
        expect(floor.rate).to.be.within(4.34, 4.36);
        expect(floor.name).to.equal('tile');
        expect(floor.photo).to.equal('/img/flooring/tile1-DELETE.png');

        var imgExists = fs.existsSync(__dirname + '/../../../app/static/img/flooring/tile1-DELETE.png');
        expect(imgExists).to.be.true;
        done();
      });
    });

    it('should create a floor - relative photo path', function(done){
      var fields = {name:['tile'], rate:['4.35']};
      var files = {photo:[{originalFilename:'tile1-DELETE.png', path:'../../test/fixtures/copy/tile1-DELETE.png', size:10}]};
      fields.photo = files.photo;

      Floor.create(fields, function(floor){
        var imgExists = fs.existsSync(__dirname + '/../../../app/static/img/flooring/tile1-DELETE.png');
        expect(imgExists).to.be.true;
        done();
      });
    });

    it('should NOT create a floor - NO PHOTO', function(done){
      var fields = {name:['tile'], rate:['4.35']};
      var files = {photo:[{size:0}]};
      fields.photo = files.photo;

      Floor.create(fields, function(floor){
        expect(floor).to.be.null;
        done();
      });
    });
  });

  describe('.findAll', function(){
    it('should find floors', function(done){
      Floor.findAll(function(floors){
        expect(floors).to.have.length(2);
        expect(floors[0]).to.be.instanceof(Floor);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a floor', function(done){
      Floor.findById('b123456789abcdef01234568', function(floor){
        expect(floor).to.be.instanceof(Floor);
        expect(floor.name).to.equal('cement');
        done();
      });
    });
  });

});
