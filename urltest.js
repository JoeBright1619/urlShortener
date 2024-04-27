
require('dotenv').config();
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>{
     console.log('MongoDB Connected')
})
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

   const finding = ( prop, value , callback)=>{ 
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
         shorturl: shorten
     });
     urlcreate.save()
         .then((done)=>{
             callback(null,done)
         })
         .catch((err)=>{
             callback(err,null)
         })
         
     }
   
  /* creating("https://www.instagram.com",3,(err, done)=>{
     if (err){
         console.log("creation has failed due to error: "+ err)
     }
     else{
         console.log("done creating data: "+ done)
     }
   })*/
   /*
   finding("url","https://www.instagram.com",(err,done)=>{
     if(err){
         console.log("the error encoutered while finding: "+ err);
     }
     else{
         if(done==null){
             console.log("data extracted but "+done);
         }
         else{
         console.log("data extracted is: "+ done);
         }
     }
   })
   */