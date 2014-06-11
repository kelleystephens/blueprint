'use strict';

var traceur = require('traceur');
var Floor = traceur.require(__dirname + '/../models/floor.js');
var mp = require('multiparty');

exports.new = (req, res)=>{
  res.render('floors/new', {title: 'New Floor'});
};

exports.create = (req, res)=>{
  var form = new mp.Form();
  form.parse(req, (err, fields, files)=>{
    fields.photo = files.photo;
    Floor.create(fields, ()=>res.redirect('/floors'));
  });
};

exports.index = (req, res)=>{
  Floor.findAll(floors=>res.render('floors/index', {floors:floors, title: 'Floors'}));
};
