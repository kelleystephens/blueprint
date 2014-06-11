var floorCollection = global.nss.db.collection('floors');
var Mongo = require('mongodb');
var fs = require('fs');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');

class Floor{
  static create(obj, fn){
    if(!obj.photo[0].size){fn(null); return;}

    var floor = new Floor();
    floor._id = Mongo.ObjectID(obj._id);
    floor.name = obj.name[0];
    floor.rate = parseFloat(obj.rate[0]);
    floor.photo = '/img/flooring/' + obj.photo[0].originalFilename;

    var path = obj.photo[0].path;

    if(path[0] !== '/'){
      path = __dirname + '/' + path;
    }

    fs.renameSync(path, __dirname + '/../static/img/flooring/' + obj.photo[0].originalFilename);
    floorCollection.save(floor, ()=>fn(floor));
  }

  static findAll(fn){
    Base.findAll(floorCollection, Floor, fn);
  }

  static findById(id, fn){
    Base.findById(id, floorCollection, Floor, fn);
  }
}

module.exports = Floor;
