const express = require('express');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets and root directory
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Explicit Routes
app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'style.css'));
});

app.get('/resume', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'resume.html'));
});

app.get('/assets/resume.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'resume.html'));
});

// PRICE Protosem Week 0 Blog Routes
app.get(['/price-protosem', '/price-protosem-0th-week', '/protosem-week-0', '/price-protosem-week-0', '/week-00-story'], (req, res) => {
  res.sendFile(path.join(__dirname, 'price-protosem-0th-week.html'));
});

// Infosys Springboard 7.0 Week 1 Recap Routes
app.get(['/infosys-springboard-week-1', '/springboard-week-1', '/week-1-recap', '/infosys-week-1'], (req, res) => {
  res.sendFile(path.join(__dirname, 'infosys-springboard-week-1.html'));
});

// PRICE Protosem Week 2 Blog Routes
app.get(['/price-protosem-week-2', '/price-protosem-week-02', '/week-2', '/week-02', '/protosem-week-2', '/price-protosem-2'], (req, res) => {
  res.sendFile(path.join(__dirname, 'price-protosem-week-2.html'));
});

// PRICE Protosem Week 3 Blog Routes
app.get(['/price-protosem-week-3', '/price-protosem-week-03', '/week-3', '/week-03', '/protosem-week-3', '/price-protosem-3'], (req, res) => {
  res.sendFile(path.join(__dirname, 'price-protosem-week-3.html'));
});

// PRICE Protosem Week 4 Blog Routes
app.get(['/price-protosem-week-4', '/price-protosem-week-04', '/week-4', '/week-04', '/protosem-week-4', '/price-protosem-4'], (req, res) => {
  res.sendFile(path.join(__dirname, 'price-protosem-week-4.html'));
});

// PRICE Protosem Week 6 Blog Routes (Page 1: Laser Cutting)
app.get(['/price-protosem-week-6', '/week-6', '/week-06', '/protosem-week-6', '/price-protosem-6', '/week-6-laser', '/price-protosem-week-6-laser'], (req, res) => {
  res.sendFile(path.join(__dirname, 'price-protosem-week-6.html'));
});

// PRICE Protosem Week 6 Blog Routes (Page 2: 3D Printing)
app.get(['/price-protosem-week-6-3d-printing', '/week-6-3d', '/week-06-3d', '/protosem-week-6-3d', '/week-6-3d-printing'], (req, res) => {
  res.sendFile(path.join(__dirname, 'price-protosem-week-6-3d-printing.html'));
});

// POST /contact — save message to messages.txt
app.post('/contact', (req, res) => {
  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim();
  const message = (req.body.message || '').trim();

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  const entry = [
    '---',
    `Date   : ${new Date().toLocaleString()}`,
    `Name   : ${name}`,
    `Email  : ${email}`,
    `Message: ${message}`,
    '',
  ].join('\n');

  const filePath = path.join(__dirname, 'messages.txt');

  fs.appendFile(filePath, entry, (err) => {
    if (err) {
      console.error('Error saving message:', err);
      return res.status(500).json({ message: 'Failed to save message. Please try again.' });
    }
    console.log(`New message from ${name} (${email})`);
    res.json({ message: 'Message received! I will get back to you soon.' });
  });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅  Server running at http://localhost:${PORT}`);
});
