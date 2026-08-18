require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Category, Product } = require('./models');
async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/greenroot');
  const categories = await Category.bulkWrite([
    { updateOne: { filter: { slug: 'vegetables' }, update: { $set: { name: 'Vegetables', icon: '🥬', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&q=85' } }, upsert: true } },
    { updateOne: { filter: { slug: 'plants' }, update: { $set: { name: 'Plants', icon: '🪴', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=85' } }, upsert: true } }
  ]);
  const veg = await Category.findOne({ slug: 'vegetables' }); const plants = await Category.findOne({ slug: 'plants' });
  const products = [
    { name: 'Organic Spinach', slug: 'organic-spinach', category: veg._id, categoryName: veg.name, description: 'Farm-fresh organic spinach.', images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=900&q=85'], price: 49, mrp: 65, stock: 40, lowStockThreshold: 10, unit: '250g bunch' },
    { name: 'Money Plant', slug: 'money-plant', category: plants._id, categoryName: plants.name, description: 'A low-maintenance indoor plant.', images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=900&q=85'], price: 199, mrp: 249, stock: 15, lowStockThreshold: 5, unit: '1 plant' },
    { name: 'Fresh Red Tomatoes', slug: 'fresh-red-tomatoes', category: veg._id, categoryName: veg.name, description: 'Fresh, juicy red tomatoes sourced from local farms.', images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=900&q=85'], price: 79, mrp: 99, stock: 50, lowStockThreshold: 10, unit: '500g pack' }
  ];
  for (const p of products) await Product.updateOne({ slug: p.slug }, { $set: p }, { upsert: true });
  const passwordHash = await bcrypt.hash('Admin@123', 12); await User.updateOne({ email: 'admin@greenroot.local' }, { $setOnInsert: { fullName: 'GreenRoot Admin', email: 'admin@greenroot.local', mobile: '9999999999', passwordHash, role: 'admin' } }, { upsert: true });
  console.log('Seed complete. Admin: admin@greenroot.local / Admin@123'); await mongoose.disconnect();
}
seed().catch(e => { console.error(e); process.exit(1); });
