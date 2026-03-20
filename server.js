require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const https   = require('https');

const app      = express();
const PORT     = process.env.REACT_APP_PROXY_PORT || 4000;
const ENDPOINT = process.env.REACT_APP_HYGRAPH_ENDPOINT;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// All GraphQL requests go through this proxy — the real endpoint never reaches the browser
app.post('/api/graphql', (req, res) => {
  const url  = new URL(ENDPOINT);
  const body = JSON.stringify(req.body);

  const options = {
    hostname: url.hostname,
    path:     url.pathname,
    method:   'POST',
    headers: {
      'Content-Type':   'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  const request = https.request(options, (response) => {
    let data = '';
    response.on('data', chunk => { data += chunk; });
    response.on('end', () => {
      res.status(response.statusCode).json(JSON.parse(data));
    });
  });

  request.on('error', () => res.status(500).json({ error: 'Proxy error' }));
  request.write(body);
  request.end();
});

app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
