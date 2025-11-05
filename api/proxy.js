import fetch from 'node-fetch';

export default async function handler(req, res) {
  const streamUrl = req.query.url;
  console.log(`Proxying request for URL: ${streamUrl}`);

  if (!streamUrl) {
    console.error('No stream URL provided');
    return res.status(400).send('Error: No stream URL provided');
  }

  try {
    const response = await fetch(streamUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        
        // --- ADD THESE HEADERS TO DEFEAT THE 403 ERROR ---
        'Referer': 'https://www.fancode.com/',
        'Origin': 'https://www.fancode.com'
      }
    });

    if (!response.ok) {
      console.error(`Fetch error: ${response.status} ${response.statusText}`);
      return res.status(response.status).send(`Error fetching stream: ${response.statusText}`);
    }

    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'application/vnd.apple.mpegurl');
    
    response.body.pipe(res);

  } catch (error) {
    console.error('Proxy function crashed:', error);
    return res.status(500).send('Internal Server Error');
  }
}
