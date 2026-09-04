import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://wjietprjbfngjatbxhhp.supabase.co';
const anonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqaWV0cHJqYmZuZ2phdGJ4aGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0OTA3NzksImV4cCI6MjEwNDA2Njc3OX0.LNbHa7AmuBspD-8eC2Yal3ZeZo3I45iR4wLM3uBQcy0';

console.log(`[Keep-Alive] Pinging Supabase at ${supabaseUrl}...`);

const url = new URL(`${supabaseUrl}/rest/v1/`);
const options = {
  hostname: url.hostname,
  port: 443,
  path: '/rest/v1/',
  method: 'GET',
  headers: {
    'apikey': anonKey,
    'Authorization': `Bearer ${anonKey}`,
    'User-Agent': 'Blooma-KeepAlive/1.0'
  }
};

const req = https.request(options, (res) => {
  console.log(`[Keep-Alive] Response Status Code: ${res.statusCode}`);
  res.on('data', () => {});
  res.on('end', () => {
    console.log('[Keep-Alive] Ping finished successfully. Database activity refreshed.');
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error(`[Keep-Alive] Error during ping: ${e.message}`);
  process.exit(1);
});

req.end();
