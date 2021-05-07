var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./chinook.db');
const RandExp=require('randexp')
/* GET users listing. */
db.run("CREATE TABLE urlshortener([shortid] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,[shortcode] NVARCHAR(120) unique,[redirectCount] integer,[startDate] datetime,[lastSeenDate] datetime,url text,shorturl text)", 
function(error){
  // db.run('delete from urlshortener')
  // console.log('table created')
});
router.get('/:shortcode', function(req, res, next) {
  try {
    db.get('Select shortid,redirectCount,url from urlshortener where shortcode=$shortcode',{
      $shortcode:req.params.shortcode
    },(error,rows)=>{
      if(rows==undefined||rows==null||rows.length<=0){
        return res.status(404).json({"ERROR":"Not FOUND"});
      }
      else{
        db.run('update urlshortener set lastSeenDate=$lastSeenDate,redirectCount=$redirectCount where shortcode=$shortcode',{
          $lastSeenDate:new Date().toISOString(),
          $redirectCount:rows.redirectCount+1,
          $shortcode:req.params.shortcode
        },(error,rows1)=>{
          var msg='HTTP/1.1 302 FOUND'
          let Location=rows.url
          return res.status(302).json({msg,Location});
      })
     
    }
    })
  
  } catch (error) {
    res.status(403).json(error);
    next(error)
  }

});
router.get('/:shortcode/stats', function(req, res, next) {
  try {
    db.get('Select startDate,lastSeenDate,redirectCount from urlshortener where shortcode=$shortcode',{
      $shortcode:req.params.shortcode
    },(error,rows)=>{
      if(rows==undefined||rows==null||rows.length<=0){
        return res.status(404).json({"ERROR":"Not FOUND"});
      }
      else{
        return res.status(200).json(rows);
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
    db.get('Select * from urlshortener where shortcode=$shortcode',{
      $shortcode:req.body.shortcode
    },(error,rows)=>{
      
        if(rows==undefined||rows==null||rows.length>0){
          db.run(`insert into urlshortener(url,startDate,shortcode,shorturl,redirectCount) Values(?,?,?,?,?)`,
          [req.body.url,new Date().toISOString(),req.body.shortcode || shorturl,shorturl,0],
          (error)=>{
            if (error) {
              return res.status(500).json({'ERROR':error.message});
            }
            
            return res.status(201).json({'shortcode':req.body.shortcode || shorturl});
        }
          )
        }
        else{
          return res.status(409).json({"ERROR":'Urlshortcode already exists'});
        }
      
    }
    )
  } catch (error) {

    res.status(403).json(error);
  }
});
module.exports = router;
