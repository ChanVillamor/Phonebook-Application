const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
});

// Get all contacts, grouped by first letter of name
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ name: 1 });
        // Group contacts by first letter
        const grouped = contacts.reduce((acc, contact) => {
            const firstLetter = contact.name.charAt(0).toUpperCase();
            if (!acc[firstLetter]) {
                acc[firstLetter] = [];
            }
            acc[firstLetter].push(contact);
            return acc;
        }, {});
        res.json(grouped);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search contacts
router.get('/search', async (req, res) => {
    try {
        const { query, status } = req.query;
        let searchQuery = {};

        if (query) {
            searchQuery.$or = [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { mobileNo: { $regex: query, $options: 'i' } }
            ];
        }

        if (status) {
            searchQuery.status = status;
        }

        const contacts = await Contact.find(searchQuery).sort({ name: 1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get favorite contacts
router.get('/favorites', async (req, res) => {
    try {
        const favorites = await Contact.find({ favorite: true }).sort({ name: 1 });
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single contact
router.get('/:id', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create contact
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const contactData = {
            ...req.body,
            image: req.file ? req.file.path : null
        };

        const contact = new Contact(contactData);
        const newContact = await contact.save();
        res.status(201).json(newContact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update contact
const fs = require('fs').promises;  // use promises API for fs

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    const updateData = { ...req.body };

    if (req.file) {
      // Delete old image file if exists
      if (contact.image) {
        const oldImagePath = path.resolve(__dirname, '..', contact.image);
        try {
          await fs.access(oldImagePath);  // check if file exists
          await fs.unlink(oldImagePath);  // delete file
          console.log('Old image deleted:', oldImagePath);
        } catch (err) {
          // file does not exist or other error
          console.warn('Old image not found or cannot delete:', oldImagePath);
        }
      }

      updateData.image = req.file.path;  // update with new image path
    }

    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedContact);

  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(400).json({ message: error.message });
  }
});


// Toggle favorite status
router.patch('/:id/favorite', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        contact.favorite = !contact.favorite;
        const updatedContact = await contact.save();
        res.json(updatedContact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete contact
router.delete('/:id', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.json({ message: 'Contact deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 