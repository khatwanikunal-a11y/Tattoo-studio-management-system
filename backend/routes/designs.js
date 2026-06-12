const express = require('express');
const router = express.Router();
const Design = require('../models/Design');
const Artist = require('../models/Artist');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/designs
router.get('/', async (req, res, next) => {
  try {
    const designs = await Design.find()
      .populate('artist_id', 'name speciality')
      .sort({ createdAt: -1 });
    res.status(200).json(designs);
  } catch (err) { next(err); }
});

// GET /api/designs/search?q=
router.get('/search', async (req, res, next) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'Query parameter q is required' });
  try {
    const designs = await Design.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { style: { $regex: q, $options: 'i' } }
      ]
    }).populate('artist_id', 'name speciality');
    res.status(200).json(designs);
  } catch (err) { next(err); }
});

// GET /api/designs/by-artist/:artistId
router.get('/by-artist/:artistId', async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.artistId);
    if (!artist) return res.status(404).json({ error: 'Artist not found' });
    const designs = await Design.find({ artist_id: req.params.artistId }).sort({ createdAt: -1 });
    res.status(200).json(designs);
  } catch (err) { next(err); }
});

// GET /api/designs/:id
router.get('/:id', async (req, res, next) => {
  try {
    const design = await Design.findById(req.params.id)
      .populate('artist_id', 'name speciality years_exp');
    if (!design) return res.status(404).json({ error: 'Design not found' });
    res.status(200).json(design);
  } catch (err) { next(err); }
});

// POST /api/designs  [Logged-in users]
router.post('/', protect, async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.body.artist_id);
    if (!artist) return res.status(404).json({ error: 'Artist not found' });
    const design = await Design.create(req.body);
    res.status(201).json(design);
  } catch (err) { next(err); }
});

// PUT /api/designs/:id  [Admin only]
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const design = await Design.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!design) return res.status(404).json({ error: 'Design not found' });
    res.status(200).json(design);
  } catch (err) { next(err); }
});

// DELETE /api/designs/:id  [Admin only]
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const design = await Design.findByIdAndDelete(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });
    res.status(200).json({ message: 'Design deleted successfully' });
  } catch (err) { next(err); }
});

module.exports = router;
