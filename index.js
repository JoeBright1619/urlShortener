require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const checkURL = require('./test.js')

const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

// Middleware

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());
// Static files
app.use('/public', express.static(`${process.cwd()}/public`));

// Homepage
app.get('/', (req, res) => {
  res.sendFile(`${process.cwd()}/views/index.html`);
});

// URL array (for demonstration, replace with database)
const urlArr = [];
// database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

  const urlSchema = new mongoose.Schema({
    url: {
      type: String,
      required: true
    },
    shorturl: {
      type: Number,
      required: true
    }
  });

  const urlModel = mongoose.model('url', urlSchema);

   const finding = ( prop, value, callback)=>{ 
     var query ={};
     if(value==""){
     }
     else{
     query[prop]= value;
     }
     urlModel.find(query)
   .then((user)=>{
     callback(null, user);
   })
   .catch((err)=>{
     callback(err, null);
   });
   }
 
   const creating = (url, shorten, callback) =>{
     var urlcreate = new urlModel({
         url: url,
         shorturl: shorten + 1
     });
     urlcreate.save()
         .then((done)=>{
             callback(null,done)
         })
         .catch((err)=>{
             callback(err,null)
         })
         
     }

// API endpoint to create short URLs
app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;
var urlFull= new URL(url);
checkURL(urlFull,(isValid)=>{
  if (isValid) {
    //finding the url in the database
    finding("url",urlFull.href,(err,data)=>{
      if(err){
          console.log("there was an error encoutered while finding url( "+urlFull.href+" ): "+ err);
      }
      else{
          if( data.length==0){
            console.log("no data available in the database");

             finding("url","",(err, found)=>{
               if(err){
                 console.log("error while retrieving the number of all the urls in database with error :"+ err)
               }
               else{
                 var urlShortId = found.length;
                 console.log("number of all the urls in database is : "+ urlShortId);
                 
                 creating(urlFull.href, urlShortId, (err, inserted)=>{
                  if(err){
                    console.log("inserting the new url has failed due to error :"+ err);
                  }
                  else{
                    console.log(`successfully inserted url ${inserted}`);
                  }
                 });

                 res.json({
                  original_url: url,
                  short_url: urlShortId + 1
                })

               }
             });
           
      
          }
          else{
           
            console.log(`data already available and extracted as: `+ data);
            res.json({
              original_url: url,
              short_url: data[0].shorturl
            })
          }
      }
    })

  
  
  } else {
    console.log("yap!! the url is invalid")
    res.json({ error: "Invalid URL" });
  }
});

});

// API endpoint to redirect short URLs
app.get('/api/shorturl/:short', (req, res) => {
  const short = req.params.short;
  console.log("I just redirected!!!")
  if(isNaN(short) || short==0){
    res.json({"error":"Wrong format"});
    console.log("wrong format!!!!"+short+" is not allowed" )
  }
  else{
  finding("shorturl", short,(err, found)=>{
    if(err){
      console.log("error while retrieving the number of all the urls in database with error :"+ err)
    }
    else{
      if(found.length==0){
        console.log("the url path with the shorturl '"+short+"' does not exist");
        res.json({ "error":"No short URL found for the given input" });
      }
    else if(found.length==1){
        console.log("found the url details of shorturl '"+short+"' and it's "+ found[0].url);
        res.redirect(found[0].url);
    }
    else{
      console.log("there is a duplicate of urls with the same shorturl:"+ found);
      res.json({
        "error" : "multiple urls sharing the same shorturl"
      })
    }
    }
  });

 
  }
  }
);



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
