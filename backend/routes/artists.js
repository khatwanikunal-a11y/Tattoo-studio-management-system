const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/artists
router.get('/', async (req, res, next) => {
  try {
    const artists = await Artist.find().sort({ createdAt: -1 });
    res.status(200).json(artists);
  } catch (err) { next(err); }
});

// GET /api/artists/search?q=
router.get('/search', async (req, res, next) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'Query parameter q is required' });
  try {
    const artists = await Artist.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { speciality: { $regex: q, $options: 'i' } }
      ]
    }).sort({ name: 1 });
    res.status(200).json(artists);
  } catch (err) { next(err); }
});

// GET /api/artists/:id
router.get('/:id', async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ error: 'Artist not found' });
    res.status(200).json(artist);
  } catch (err) { next(err); }
});

// POST /api/artists  [Admin only]
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const artist = await Artist.create(req.body);
    res.status(201).json(artist);
  } catch (err) { next(err); }
});

// PUT /api/artists/:id  [Admin only]
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!artist) return res.status(404).json({ error: 'Artist not found' });
    res.status(200).json(artist);
  } catch (err) { next(err); }
});

// DELETE /api/artists/:id  [Admin only]
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);
    if (!artist) return res.status(404).json({ error: 'Artist not found' });
    res.status(200).json({ message: 'Artist deleted successfully' });
  } catch (err) { next(err); }
});

module.exports = router;
