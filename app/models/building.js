var buildingCollection = global.nss.db.collection('buildings');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var Room = traceur.require(__dirname + '/room.js');
var Location = traceur.require(__dirname + '/location.js');
var Floor = traceur.require(__dirname + '/floor.js');
var Mongo = require('mongodb');
var async = require('async');

class Building{
  static create(obj, fn){
    var building = new Building();
    building._id = Mongo.ObjectID(obj._id);
    building.name = obj.name;
    building.x = parseInt(obj.x);
    building.y = parseInt(obj.y);
    building.rooms = [];
    building.locationId = Mongo.ObjectID(obj.locationId);
    building.userId = Mongo.ObjectID(obj.userId);
    buildingCollection.save(building, ()=>fn(building));
  }

  static findAllByUserId(userId, fn){
    Base.findAllByUserId(userId, buildingCollection, Building, fn);
  }

  static findById(id, fn){
    Base.findById(id, buildingCollection, Building, fn);
  }

  static findByIdFullObject(id, fn){
    Base.findById(id, buildingCollection, Building, bldg=>{

      Location.findById(bldg.locationId, loc=>{
        bldg.location = loc;
        async.map(bldg.rooms, transformRoom, (e, rooms)=>{
          bldg.rooms = rooms;
          fn(bldg);
        });
      });
    });
  }

  addRoom(obj, fn){
    var room = new Room(obj);
    this.rooms.push(room);
    buildingCollection.update({_id:this._id}, {$push:{rooms:room}}, ()=>fn(this));
  }

  cost(fn){
    Location.findById(this.locationId, loc=>{
      var rate = loc.rate * this.x * this.y;

      async.map(this.rooms, transformRoom, (e, rooms)=>{
        rate += rooms.reduce((acc, room)=>{
          var sqft = (room.end.x + 1 - room.begin.x) * (room.end.y + 1 - room.begin.y);
          return (sqft * room.floor.rate) + (acc);
        }, 0);
        fn(rate);
      });

    });
  }
}

function transformRoom(room, fn){
  'use strict';

  Floor.findById(room.floorId, floor=>{
    room.floor = floor;
    fn(null, room);
  });
}

module.exports = Building;
