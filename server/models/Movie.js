const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true,
  },
  title: String,
  poster: String,
  type: String, // "movie" or "tv"
  genre: [String],
  year: Number,
});

module.exports = mongoose.model('Movie', MovieSchema);
