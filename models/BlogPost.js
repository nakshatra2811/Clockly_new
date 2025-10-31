// models/BlogPost.js
const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  category: String,
  title: String,
  excerpt: String,
  date: Date,
  content: String,
});

module.exports = mongoose.model('BlogPost', blogPostSchema);