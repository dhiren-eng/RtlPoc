const mgClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const dbName = "tshirtfly";
const dbURL = "mongodb://localhost/27017/";
const mongoOption = { useUnifiedTopology: true };

const state = {
  db: null
}

const connect = (cb) => {
  if(state.db)
    cb();
  else {
    mgClient.connect(dbURL, mongoOption, (err, client) => {
      if(err)
        cb('Error connection to database');
      else {
        state.db = client.db(dbName);
        cb();
      } 
    });
  }
}

const getPrimaryKey = (_id) => {
  return objectId(_id);
}


const getDB = () => {
    return state.db;
}

module.exports = {connect, getDB, getPrimaryKey};