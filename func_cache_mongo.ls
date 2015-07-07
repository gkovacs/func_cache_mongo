require! 'get-function-name'
{MongoClient} = require 'mongodb'

func_cache_mongo = (mongo_url) ->
  if not mongo_url?
    mongo_url = process.env.MONGOHQ_URL ? process.env.MONGOLAB_URI ? process.env.MONGOSOUP_URL ? 'mongodb://localhost:27017/default'
  get-mongo-db = (callback) ->
    MongoClient.connect mongo_url, (err, db) ->
      if err
        console.log 'error getting mongodb'
      else
        callback db
  return (f, cache_name) ->
    if not cache_name?
      cache_name = get-function-name(f)
    return (params, callback) ->
      get-mongo-db (db) ->
        collection = db.collection cache_name
        nkey = new Buffer(JSON.stringify(params), 'utf8').toString('base64')
        collection.findOne {_id: nkey}, (err, result) ->
          if result?
            realres = new Buffer(result.res, 'base64').toString('utf8') |> JSON.parse
            callback realres
          else
            f params, (res2) ->
              if res2?
                nres = new Buffer(JSON.stringify(res2), 'utf8').toString('base64')
                collection.save {_id: nkey, res: nres}
              callback res2

module.exports = func_cache_mongo
