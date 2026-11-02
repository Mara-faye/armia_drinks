import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_PATH = path.join(__dirname, '/js/drinks_s01.json');
const IMAGES_DIR = path.join(__dirname, '/Drinks');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

const DISCORD_LAST_POST = await fs.readFile('lastPost', 'utf-8');

// Download an image from a URL and save it to the specified destination path
async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download image: ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  await fs.writeFile(destPath, Buffer.from(arrayBuffer));
}

// Retrieve posts from the menu Discord channel 
async function fetchDiscordMessages() {
    // IMPORTANT Switch to after DISCORD_LAST_POST when ready

    //const url = `https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/messages?limit=5`;
    const url = `https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/messages?after=${DISCORD_LAST_POST}`;

    const response = await fetch(url, {
        headers: { Authorization: `Bot ${DISCORD_TOKEN}` },
    });

    if (!response.ok) {
        throw new Error(`Discord API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

async function runIngestion() {
    if (!DISCORD_TOKEN || !DISCORD_CHANNEL_ID) {
        console.error('Missing DISCORD_TOKEN or DISCORD_CHANNEL_ID in .env file.');
        process.exit(1);
    }

    console.log('Retrieving latest Discord posts from Menu Channel');
    const messages = await fetchDiscordMessages();
    if (messages.length == 0) {
        console.log('No new drinks detected!');
        process.exit(1);
    }
    const sortedMessages = messages.reverse(); 

    // Read drinks_s01.json to append new entries
    const currentList = await fs.readFile(JSON_PATH, 'utf-8');
    const menu = JSON.parse(currentList);

    let newDrinkNum = 0;
    let lastDrinkId = '';

    if (menu.length > 0) {
        const lastDrinkNum = menu[menu.length - 1].file;
        newDrinkNum = parseInt(lastDrinkNum.match(/^(\d+)/)[1], 10) + 1;
    } else {
        console.error('Couldn\'t read JSON file');
        process.exit(1);
    }

    for (const msg of sortedMessages) {
        const parts = msg.content.split(/\s-\s/);
        const creator = parts[0].trim();
        const name = parts[1].trim();

        // Process Cocktail Name into safe Pascal case format
        const filename = name
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .replace(/\b\w/g, (char) => char.toUpperCase())
            .replace(/\s+/g, '');
        const ext = path.extname(msg.attachments[0].filename);
        const fullFilename = `${newDrinkNum}${filename}${ext}`;

        let newDrink = {
            name: name,
            creator: creator,
            file: fullFilename
        };
        console.info(newDrink);
        menu.push(newDrink);

        // Download image
        const destFilename =  path.join(IMAGES_DIR, fullFilename);
        downloadImage(msg.attachments[0].url, destFilename);
        console.info(destFilename);

        newDrinkNum++;
        lastDrinkId = msg.id;
    }

    console.log(lastDrinkId);
    await fs.writeFile('lastPost', lastDrinkId, 'utf-8');
    await fs.writeFile(JSON_PATH, JSON.stringify(menu, null, 4), 'utf-8');
    console.log ('Drink list updated!');

}

runIngestion();