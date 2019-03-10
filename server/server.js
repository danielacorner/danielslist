const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(express.static(path.join(__dirname, '../build')));

app.use(
  cors({
    origin: '*',
  }),
);

// Put all API endpoints under '/api'
app.get('/api/scrape/kijiji', (req, res) => {
  // console.log(req.query);
  const url = 'https://kijiji.ca';
  let $;
  request(url, (error, response, html) => {
    if (!error) {
      $ = cheerio.load(html);
    }
    res.send($);
  });
});

// Serve static files from the React app
if (process.env.NODE_ENV === 'production') {
  //production mode
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname, '../build/index.html'));
  });
}

//build mode
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  console.log(path.join(__dirname + '/../build/index.html'));
  res.sendFile(path.join(__dirname + '/../build/index.html'));
});

const port = process.env.PORT || 5000;

//Start server
app.listen(port, (req, res) => {
  console.log(`server listening on port: ${port}`);
});

exports = module.exports = app;
