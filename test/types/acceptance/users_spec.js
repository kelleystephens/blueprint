/* global describe, before, beforeEach, it */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'blueprint-test';

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
    global.nss.db.collection('users').drop(function(){
      factory('user', function(users){
        done();
      });
    });
  });

  describe('GET /login', function(){
    it('should show the login page', function(done){
      request(app)
      .get('/login')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('POST /users', function(){
    it('should create a new user', function(done){
      request(app)
      .post('/users')
      .send('email=bob@aol.com')
      .send('password=abc')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/');
        expect(res.headers['set-cookie']).to.be.ok;
        done();
      });
    });

    it('should NOT create a new user', function(done){
      request(app)
      .post('/users')
      .send('email=sue@aol.com')
      .send('password=doesnotmatter')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/login');
        expect(res.headers['set-cookie']).to.not.be.ok;
        done();
      });
    });
  });

  describe('POST /login', function(){
    it('should login an existing user', function(done){
      request(app)
      .post('/login')
      .send('email=sue@aol.com')
      .send('password=5678')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/');
        expect(res.headers['set-cookie']).to.be.ok;
        done();
      });
    });

    it('should NOT login an existing user - bad email', function(done){
      request(app)
      .post('/login')
      .send('email=wrong@aol.com')
      .send('password=5678')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/login');
        expect(res.headers['set-cookie']).to.not.be.ok;
        done();
      });
    });

    it('should NOT login an existing user - bad password', function(done){
      request(app)
      .post('/login')
      .send('email=sue@aol.com')
      .send('password=wrong')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/login');
        expect(res.headers['set-cookie']).to.not.be.ok;
        done();
      });
    });
  });

  describe('POST /logout', function(){
    it('should logout an existing user', function(done){
      request(app)
      .post('/logout')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/');
        expect(res.headers['set-cookie']).to.be.ok;
        done();
      });
    });
  });

});
