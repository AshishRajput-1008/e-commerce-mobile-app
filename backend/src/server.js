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
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));
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

const port = Number(process.env.PORT || 4000);
async function start() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/greenroot');
  app.listen(port, '0.0.0.0', () => console.log(`GreenRoot API listening on port ${port}`));
}
if (require.main === module) start().catch((error) => { console.error('MongoDB connection failed', error); process.exit(1); });
module.exports = app;
