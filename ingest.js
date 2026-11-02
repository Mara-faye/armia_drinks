import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// File path helpers for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment variables
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

// Target current season drinks
const JSON_PATH = path.join(__dirname, '../js/drinks_s01.json');
const IMAGES_DIR = path.join(__dirname, '../Drinks');


function toCamelCase(str) {
  return str
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

// Download an image from a URL and save it to the specified destination path
async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download image: ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  await fs.writeFile(destPath, Buffer.from(arrayBuffer));
}

// Fetches the last 10 entries from the menu channel
async function fetchDiscordMessages() {
  const url = `https://discord.com/api/v10/channels/${CHANNEL_ID}/messages?limit=10`;
  const response = await fetch(url, {
    headers: { Authorization: `Bot ${DISCORD_TOKEN}` },
  });
  
  if (!response.ok) {
    throw new Error(`Discord API Error: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}