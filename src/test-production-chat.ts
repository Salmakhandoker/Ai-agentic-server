import https from 'https';

const payload = JSON.stringify({
  messages: [
    { role: 'user', content: 'What are the top 3 best budgets trips in your database? Reply in one short sentence.' }
  ],
  currentUrl: 'https://ai-project-client-side.vercel.app/',
  activeListingId: null
});

const options = {
  hostname: 'ai-project-server-side.vercel.app',
  port: 443,
  path: '/api/ai/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

console.log('Sending chat request to production server...');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    try {
      const parsed = JSON.parse(data);
      console.log('Response from production server:\n', JSON.stringify(parsed, null, 2));
    } catch (err) {
      console.log('Raw response text:\n', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(payload);
req.end();
