require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const catalogRoutes = require('./routes/catalog');
const addressRoutes = require('./routes/addresses');
const orderRoutes = require('./routes/orders');

const app = express();
// Accept one or more frontend origins while allowing native clients (which
// do not send an Origin header). This is valid for credentialed browser calls.
const allowedOrigins = (process.env.CLIENT_ORIGIN || '*')
  .split(',').map((origin) => origin.trim()).filter(Boolean);
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CLIENT_ORIGIN'));
  }
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ success: true, data: { status: 'ok' } }));
app.use('/v1/auth', authRoutes);
app.use('/v1', catalogRoutes);
app.use('/v1/addresses', addressRoutes);
app.use('/v1/orders', orderRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.name === 'ValidationError' ? 400 : (err.status || 500);
  res.status(status).json({ success: false, message: status === 500 ? 'Internal server error' : err.message });
});

const port = process.env.PORT || 4000;
async function start() {
  // Open the HTTP listener first. Passenger/Plesk needs a response from the
  // process quickly; waiting for Atlas before listening causes a 504 timeout.
const server = app.listen(port, () => console.log(`GreenRoot API listening on ${port}`));
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI is required; database-backed routes are unavailable');
    return server;
  }
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 15000 });
  } catch (error) {
    console.error('MongoDB connection failed', error);
    return server;
  }
  // Keep the initial catalog useful on a fresh environment without requiring
  // a separate seed command every time the API is started.
  const { Category } = require('./models');
  const { Product } = require('./models');
  const removedCategories = await Category.find({ slug: { $in: ['seeds', 'flowers'] } }).select('_id').lean();
  if (removedCategories.length) {
    await Product.deleteMany({ category: { $in: removedCategories.map((row) => row._id) } });
    await Category.deleteMany({ _id: { $in: removedCategories.map((row) => row._id) } });
  }
  await Category.bulkWrite([
    { updateOne: { filter: { slug: 'vegetables' }, update: { $setOnInsert: { name: 'Vegetables', slug: 'vegetables', icon: '🥬', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&q=85' } }, upsert: true } },
    { updateOne: { filter: { slug: 'plants' }, update: { $set: { image: 'https://images.pexels.com/photos/9707061/pexels-photo-9707061.jpeg' }, $setOnInsert: { name: 'Plants', slug: 'plants', icon: '🪴' } }, upsert: true } },
    { updateOne: { filter: { slug: 'planters' }, update: { $set: { image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80' }, $setOnInsert: { name: 'Planters', slug: 'planters', icon: '🪴' } }, upsert: true } }
    ,{ updateOne: { filter: { slug: 'gifting' }, update: { $setOnInsert: { name: 'Gifting', slug: 'gifting', icon: '🎁', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&q=85' } }, upsert: true } }
    ,{ updateOne: { filter: { slug: 'customize-gifting' }, update: { $setOnInsert: { name: 'Customize Gifting', slug: 'customize-gifting', icon: '✨', image: 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?w=900&q=85' } }, upsert: true } }
  ]);
  return server;
}
if (require.main === module) start().catch((error) => { console.error('MongoDB connection failed', error); process.exit(1); });
module.exports = app;
