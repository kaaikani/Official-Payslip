const https = require('https');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const endpoint = process.env.REACT_APP_HYGRAPH_ENDPOINT;
  if (!endpoint) {
    return res.status(500).json({ error: 'Hygraph endpoint not configured' });
  }

  const url = new URL(endpoint);
  const body = JSON.stringify(req.body);

  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
};
