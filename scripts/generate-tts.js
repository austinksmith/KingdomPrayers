// scripts/generate-tts.js
const fs = require("fs");
const path = require("path");
const tts = require('google-tts-api');
const axios = require('axios');

async function textToSpeech(text, language = 'en', outputFile = 'output.mp3') {
  const url = await tts.getAudioUrl(text, { lang: language, slow: false, host: 'https://translate.google.com' });
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFileSync(outputFile, Buffer.from(response.data));
  console.log(`Audio file saved to: ${outputFile}`);
}

// Read translations from JSON
const translationsPath = path.resolve("../assets/translations.json");
const translations = JSON.parse(fs.readFileSync(translationsPath, "utf-8"));

const outputDir = path.resolve("../assets/audio");

async function generateAll() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const t of translations) {
    const safeLang = t.language.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const filename = `${safeLang}.mp3`;
    const filepath = path.join(outputDir, filename);

    if (!fs.existsSync(filepath)) {
    console.log(`🎙 Generating ${filename}...`);
    await textToSpeech(t.text, t.code, filepath);
    } else {
    console.log(`⏩ Skipping existing ${filename}`);
    }
  }

  console.log("✅ Done generating all audio files.");
}

generateAll().catch((err) => {
  console.error("❌ Error generating TTS files:", err);
  process.exit(1);
});
