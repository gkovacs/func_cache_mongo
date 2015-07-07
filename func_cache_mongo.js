// Generated by LiveScript 1.3.1
(function(){
  var getFunctionName, MongoClient, func_cache_mongo;
  getFunctionName = require('get-function-name');
  MongoClient = require('mongodb').MongoClient;
  func_cache_mongo = function(mongo_url){
    var ref$, getMongoDb;
    if (mongo_url == null) {
      mongo_url = (ref$ = process.env.MONGOHQ_URL) != null
        ? ref$
        : (ref$ = process.env.MONGOLAB_URI) != null
          ? ref$
          : (ref$ = process.env.MONGOSOUP_URL) != null ? ref$ : 'mongodb://localhost:27017/default';
    }
    getMongoDb = function(callback){
      return MongoClient.connect(mongo_url, function(err, db){
        if (err) {
          return console.log('error getting mongodb');
        } else {
          return callback(db);
        }
      });
    };
    return function(f, cache_name){
      if (cache_name == null) {
        cache_name = getFunctionName(f);
      }
      return function(params, callback){
        return getMongoDb(function(db){
          var collection, nkey;
          collection = db.collection(cache_name);
          nkey = new Buffer(JSON.stringify(params), 'utf8').toString('base64');
          return collection.findOne({
            _id: nkey
          }, function(err, result){
            var realres;
            if (result != null) {
              realres = JSON.parse(
              new Buffer(result.res, 'base64').toString('utf8'));
              return callback(realres);
            } else {
              return f(params, function(res2){
                var nres;
                if (res2 != null) {
                  nres = new Buffer(JSON.stringify(res2), 'utf8').toString('base64');
                  collection.save({
                    _id: nkey,
                    res: nres
                  });
                }
                return callback(res2);
              });
            }
          });
        });
      };
    };
  };
  module.exports = func_cache_mongo;
}).call(this);
