const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Movie = require('../models/Movie');
const jwt = require('jsonwebtoken');

// ✅ Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ msg: 'Invalid token' });
  }
}

// ✅ Add movie to a list
router.post('/:listType', verifyToken, async (req, res) => {
  const { listType } = req.params; // favorites, watched, recommended
  const { tmdbId, title, poster, type, genre, year } = req.body;

  if (!['favorites', 'watched', 'recommended'].includes(listType)) {
    return res.status(400).json({ msg: 'Invalid list type' });
  }

  try {
    let movie = await Movie.findOne({ tmdbId });

    if (!movie) {
      movie = await Movie.create({ tmdbId, title, poster, type, genre, year });
    }

    const user = await User.findById(req.userId);
    if (!user[listType].includes(movie._id)) {
      user[listType].push(movie._id);
      await user.save();
    }

    res.json({ msg: `Added to ${listType}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ Remove movie from list
router.delete('/:listType/:tmdbId', verifyToken, async (req, res) => {
  const { listType, tmdbId } = req.params;

  if (!['favorites', 'watched', 'recommended'].includes(listType)) {
    return res.status(400).json({ msg: 'Invalid list type' });
  }

  try {
    const movie = await Movie.findOne({ tmdbId });
    if (!movie) return res.status(404).json({ msg: 'Movie not found' });

    const user = await User.findById(req.userId);
    user[listType] = user[listType].filter(id => id.toString() !== movie._id.toString());
    await user.save();

    res.json({ msg: `Removed from ${listType}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ Get all movies from a list
router.get('/:listType', verifyToken, async (req, res) => {
  const { listType } = req.params;

  if (!['favorites', 'watched', 'recommended'].includes(listType)) {
    return res.status(400).json({ msg: 'Invalid list type' });
  }

  try {
    const user = await User.findById(req.userId).populate(listType);
    res.json(user[listType]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
