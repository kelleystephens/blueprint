/* global describe, before, beforeEach, afterEach, it */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'blueprint-test';

var cp = require('child_process');
var expect = require('chai').expect;
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');
var app = require('../../../app/app');
var request = require('supertest');

var User;

describe('floors', function(){

  before(function(done){
    db(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('buildings').drop(function(){
      global.nss.db.collection('users').drop(function(){
        global.nss.db.collection('floors').drop(function(){
          global.nss.db.collection('locations').drop(function(){
            factory('user', function(users){
              factory('floor', function(floors){
                factory('location', function(locations){
                  factory('building', function(buildings){
                    cp.execFile(__dirname + '/../../fixtures/before.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
                      done();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  afterEach(function(done){
    cp.execFile(__dirname + '/../../fixtures/after.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('Authentication', function(){
    var cookie;

    beforeEach(function(done){
      request(app)
      .post('/login')
      .send('email=sue@aol.com')
      .send('password=5678')
      .end(function(err, res){
        var cookies = res.headers['set-cookie'];
        var one = cookies[0].split(';')[0];
        var two = cookies[1].split(';')[0];
        cookie = one + '; ' + two;
        done();
      });
    });

    describe('GET /buildings/new', function(){
      it('should show the new buildings web page', function(done){
        request(app)
        .get('/buildings/new')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(200);
          expect(res.text).to.include('sue@aol.com');
          expect(res.text).to.include('Mountain');
          expect(res.text).to.include('a123456789abcdef01234567');
          done();
        });
      });

      it('should NOT show the new buildings web page - not logged in', function(done){
        request(app)
        .get('/buildings/new')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/');
          done();
        });
      });
    });

    describe('POST /buildings', function(){
      it('should create a new building', function(done){
        request(app)
        .post('/buildings')
        .set('cookie', cookie)
        .send('_id=bb23456789abcdef01234567')
        .send('name=mars')
        .send('x=100')
        .send('y=50')
        .send('locationId=a123456789abcdef01234567')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/buildings/bb23456789abcdef01234567');
          done();
        });
      });

      it('should NOT create a new building - not logged in', function(done){
        request(app)
        .post('/buildings')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/');
          done();
        });
      });
    });

    describe('GET /buildings/:id', function(){
      it('should show a building', function(done){
        request(app)
        .get('/buildings/c123456789abcdef01234567')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(200);
          expect(res.text).to.include('castle');
          expect(res.text).to.include('$105.00');
          done();
        });
      });

      it('should NOT show a building - not logged in', function(done){
        request(app)
        .get('/buildings/doesnotmatter')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/');
          done();
        });
      });
    });

    describe('PUT /buildings/:id/rooms', function(){
      it('should add a room to a building', function(done){
        request(app)
        .put('/buildings/c123456789abcdef01234567/rooms')
        .send({name:'bathroom', beginX:'0', beginY:'0', endX:'4', endY:'0', floorId:'b123456789abcdef01234568'})
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal({cost:125});
          done();
        });
      });

      it('should NOT add a room to a building - not logged in', function(done){
        request(app)
        .put('/buildings/doesnotmatter/rooms')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          done();
        });
      });
    });
  });

});
