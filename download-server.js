import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Serve the zip file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'download.html'));
});

// Serve the download file
app.get('/ethiopia-tech-community.zip', (req, res) => {
  res.download(path.join(__dirname, 'ethiopia-tech-community.zip'));
});

app.listen(PORT, () => {
  console.log(`Download server running at http://localhost:${PORT}`);
  console.log('Visit this URL in your browser to download the zip file');
});