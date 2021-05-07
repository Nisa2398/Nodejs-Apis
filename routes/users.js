var express = require('express');
var router = express.Router();
var redis = require('redis');
const RandExp=require('randexp')
var client = redis.createClient();
/* GET users listing. */
router.get('/:shortcode', function(req, res, next) {
  try {
    client.hgetall(`urlshortened:${req.params.shortcode}`, function(err, object) {
      if(object==null){
        return res.status(404).json({"ERROR":"Not FOUND"});
      }
      if(object.shortcode==req.params.shortcode){
        client.hmset('urlshortened:'+req.params.shortcode, { 
 
          lastSeenDate:new Date().toISOString()
        })
        client.hincrby('urlshortened:'+req.params.shortcode,'redirectCount',1)
      
        var msg='HTTP/1.1 302 FOUND'
        let Location=object.url
        return res.status(302).json({msg,Location});
      }
      else{
        return res.status(404).json({"ERROR":"Not FOUND"});
      }
    })
   
  } catch (error) {
    res.status(403).json(error);
    next(error)
  }

});
router.get('/:shortcode/stats', function(req, res, next) {
  try {
    client.hgetall(`urlshortened:${req.params.shortcode}`, function(err, object) {
      if(object==null){
        return res.status(404).json({"ERROR":"Not FOUND"});
      }
      if(object.shortcode==req.params.shortcode){
        let result={startDate:object.startDate,lastSeenDate:object.lastSeenDate,redirectCount:object.redirectCount}
        return res.status(200).json(result);
      }
      else{
        return res.status(404).json({"ERROR":"Not FOUND"});
      }
    })
  } catch (error) {
    res.status(403).json(error);
    next(error)
  }
});
router.post('/shorten', function(req, res, next) {
  try {
    
    let count=0
    let shorturl=''
    if(req.body.url==undefined ||req.body.url==null){
      return res.status(400).json({"ERROR":'Please Enter URL'});
    }
    if(/^[0-9a-zA-Z_]{4,}$$/.test(req.body.shortcode)==false){
      return res.status(422).json({"ERROR":'Please Specify a valid regexp'});
    }
    if(!req.body.shortcode){
      shorturl=new RandExp(/^[0-9a-zA-Z_]{6}$/).gen()
    }
    else{
      shorturl=new RandExp(/^[0-9a-zA-Z_]{4,}$/).gen()
    }
    client.hgetall(`urlshortened:${req.body.shortcode||shorturl}`, function(err, object) {

      result=object;
      if(object ==null||result.shortcode!=req.body.shortcode){
        client.hmset(`urlshortened:${req.body.shortcode||shorturl}`, { 
          url:req.body.url,
          startDate:new Date().toISOString(),
          shortcode:req.body.shortcode || shorturl,
          shorturl:shorturl,
          redirectCount:0
        },function(err,result){
         client.hgetall(`urlshortened:${req.body.shortcode||shorturl}`, function(err, object) {
           
            result=object;
            return res.status(201).json({"shortcode":result.shortcode});
            });
        })
      }
      else{
        return res.status(409).json({"ERROR":'Urlshortcode already exists'});
      }
      });
     
  } catch (error) {

    res.status(403).json(error);
  }
});
module.exports = router;
