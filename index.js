require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

var urlArr = [];
// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  
  const url = req.body.url

  if(/http:\/\/www\..+\.com/.test(url)){
   // res.send({ URL: url});
    console.log(`URL: ${url}`)

  var hasObj = urlArr.find(item=>item.url==url);
    if(hasObj){
      res.send({
        original_url: hasObj.url,
        short_url: hasObj.id
      })
      console.log(hasObj.id)
    }
    else{
      urlArr.push({
        url: url,
        id: urlArr.length + 1
      })
      console.log(urlArr)
    }
  }
  else{
    console.log("error: url notfound")
  }
  
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
  const random = Math.random();
  console.log(urlArr)
});
