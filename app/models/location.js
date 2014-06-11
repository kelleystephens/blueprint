var locationCollection = global.nss.db.collection('locations');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var Mongo = require('mongodb');

class Location{
  static create(obj, fn){
    var location = new Location();
    location._id = Mongo.ObjectID(obj._id);
    location.name = obj.name;
    location.rate = parseFloat(obj.rate);
    locationCollection.save(location, ()=>fn(location));
  }

  static findAll(fn){
    Base.findAll(locationCollection, Location, fn);
  }

  static findById(id, fn){
    Base.findById(id, locationCollection, Location, fn);
  }
}

module.exports = Location;
