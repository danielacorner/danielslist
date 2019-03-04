const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();
const cors = require('cors');

app.use(
  cors({
    origin: '*',
  }),
);

app.get('/scrape', (req, res) => {
  const url = req.query.url;
  let $;
  request(url, (error, response, html) => {
    if (!error) {
      $ = cheerio.load(html);
    }
    res.send($.html('.search-item'));
  });
});

app.listen('7777');
console.log('server listening on port 7777');
exports = module.exports = app;
