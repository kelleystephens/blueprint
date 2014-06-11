'use strict';

var traceur = require('traceur');
var Building = traceur.require(__dirname + '/../models/building.js');
var Location = traceur.require(__dirname + '/../models/location.js');
var Floor = traceur.require(__dirname + '/../models/floor.js');

exports.new = (req, res)=>{
  Location.findAll(locations=>{
    res.render('buildings/new', {locations:locations, title: 'New Building'});
  });
};

exports.create = (req, res)=>{
  Building.create(req.body, bldg=>res.redirect('/buildings/' + bldg._id));
};

exports.show = (req, res)=>{
  Floor.findAll(floors=>{
    Building.findByIdFullObject(req.params.id, bldg=>{
      bldg.cost(rate=>{
        res.render('buildings/show', {floors:floors, bldg:bldg, rate:rate, title:bldg.name});
      });
    });
  });
};

exports.addRoom = (req, res)=>{
  Building.findById(req.params.id, bldg=>{
    bldg.addRoom(req.body, ()=>{
      bldg.cost(rate=>res.send({cost:rate}));
    });
  });
};
