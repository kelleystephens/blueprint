var Mongo = require('mongodb');

class Room{
  constructor(obj){
    this.name = obj.name;
    this.begin = {x:obj.beginX*1, y:obj.beginY*1};
    this.end = {x:obj.endX*1, y:obj.endY*1};
    this.floorId = Mongo.ObjectID(obj.floorId);
  }
}

module.exports = Room;
