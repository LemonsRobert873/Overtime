// This is a Vercel serverless function that acts as a proxy for video streams.
// It's designed to solve CORS (Cross-Origin Resource Sharing) issues that can
// prevent a web player from loading streams from a different domain.

// We use node-fetch to make server-side requests.
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Get the target stream URL from the query parameters.
  const streamUrl = req.query.url;

  if (!streamUrl) {
    return res.status(400).send('Error: No stream URL provided');
  }

  try {
    // Set CORS headers to allow requests from any origin.
    // This is the key to solving the CORS problem.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight 'OPTIONS' requests sent by browsers to check CORS permissions.
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    // Fetch the actual stream from the target URL.
    const response = await fetch(streamUrl);

    if (!response.ok) {
      return res.status(response.status).send(`Error fetching stream: ${response.statusText}`);
    }

    // Set the appropriate content-type header for the client (e.g., for HLS streams).
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'application/vnd.apple.mpegurl');
    
    // Pipe the fetched stream's body directly to the client's response.
    // This efficiently streams the video data without buffering it on the server.
    response.body.pipe(res);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('Internal Server Error');
  }
}
