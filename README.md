# func_cache_mongo

## Install

```
npm install func_cache_mongo
```

## Usage

```javascript
func_cache = require('./func_cache_mongo')()

get_image_url = (query, callback) ->
  Bing.images query, {}, (error, res2, body) ->
    callback [x.MediaUrl for x in body.d.results]

get_image_url_cached = func_cache(get_image_url)
```