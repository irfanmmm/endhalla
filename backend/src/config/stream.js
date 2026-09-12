const { StreamClient } = require('@stream-io/node-sdk');

let streamClient;

function getStreamClient() {
  if (!streamClient) {
    const apiKey = process.env.STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;
    if (!apiKey || !apiSecret) {
      throw new Error('STREAM_API_KEY / STREAM_API_SECRET not configured');
    }
    streamClient = new StreamClient(apiKey, apiSecret);
  }
  return streamClient;
}

module.exports = { getStreamClient };
