const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500', '*'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Helper: read JSON data file
const readData = (filename) => {
  const filePath = path.join(__dirname, 'data', filename);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

// Helper: write JSON data file
const writeData = (filename, data) => {
  const filePath = path.join(__dirname, 'data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// ─── ROUTES ──────────────────────────────────────────────────────────────────

// GET /api/projects
app.get('/api/projects', (req, res) => {
  try {
    const projects = readData('projects.json');
    const { category } = req.query;
    if (category && category !== 'All') {
      const filtered = projects.filter(p => p.category === category);
      return res.json({ success: true, data: filtered });
    }
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
});

// GET /api/testimonials
app.get('/api/testimonials', (req, res) => {
  try {
    const testimonials = readData('testimonials.json');
    res.json({ success: true, data: testimonials });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
  }
});

// POST /api/contact
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, phone, designNeeded, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields.'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    // Create contact record
    const newContact = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      designNeeded: designNeeded || 'Not specified',
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    // Save to JSON
    const contacts = readData('contacts.json');
    contacts.push(newContact);
    writeData('contacts.json', contacts);

    res.status(201).json({
      success: true,
      message: "Thanks for reaching out! We'll get back to you within 24 hours.",
      data: { id: newContact.id }
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again or contact us directly.'
    });
  }
});

// GET /api/contacts (admin view — protect in production)
app.get('/api/contacts', (req, res) => {
  try {
    const contacts = readData('contacts.json');
    res.json({ success: true, data: contacts, total: contacts.length });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch contacts' });
  }
});

// Root — serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Refiners Media server running on http://localhost:${PORT}`);
  console.log(`📁 API Endpoints:`);
  console.log(`   GET  /api/projects`);
  console.log(`   GET  /api/testimonials`);
  console.log(`   POST /api/contact\n`);
});
