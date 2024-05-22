const express = require('express');
const cors = require('cors');
const dns = require('dns');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  res.sendFile(`${process.cwd()}/views/index.html`);
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

const urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: Number
});

const Url = mongoose.model('Url', urlSchema);

// Utility function for URL validation
const validateUrl = (url, callback) => {
  try {
    const urlObj = new URL(url);
    dns.lookup(urlObj.hostname, (err) => {
      callback(!err);
    });
  } catch (e) {
    callback(false);
  }
};

// API endpoint to create short URLs
app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;
  validateUrl(url, (isValid) => {
    if (isValid) {
      Url.findOne({ original_url: url })
        .then(foundUrl => {
          if (foundUrl) {
            res.json({ original_url: foundUrl.original_url, short_url: foundUrl.short_url });
          } else {
            Url.countDocuments({})
              .then(count => {
                const newUrl = new Url({ original_url: url, short_url: count + 1 });
                newUrl.save()
                  .then(savedUrl => res.json({ original_url: savedUrl.original_url, short_url: savedUrl.short_url }))
                  .catch(err => res.json({ error: 'Database error' }));
              })
              .catch(err => res.json({ error: 'Database error' }));
          }
        })
        .catch(err => res.json({ error: 'Database error' }));
    } else {
      res.json({ error: 'Invalid URL' });
    }
  });
});

// API endpoint to redirect short URLs
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = req.params.short_url;
  if (isNaN(shortUrl) || shortUrl <= 0) {
    return res.json({ error: 'Wrong format' });
  }
  Url.findOne({ short_url: shortUrl })
    .then(foundUrl => {
      if (foundUrl) {
        res.redirect(foundUrl.original_url);
      } else {
        res.json({ error: 'No short URL found for the given input' });
      }
    })
    .catch(err => res.json({ error: 'Database error' }));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
