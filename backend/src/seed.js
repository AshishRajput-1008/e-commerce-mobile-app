require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Category, Product } = require('./models');
async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/greenroot');
  const removedCategories = await Category.find({ slug: { $in: ['seeds', 'flowers'] } }).select('_id').lean();
  if (removedCategories.length) {
    await Product.deleteMany({ category: { $in: removedCategories.map((row) => row._id) } });
    await Category.deleteMany({ _id: { $in: removedCategories.map((row) => row._id) } });
  }
  await Product.deleteMany({ slug: { $in: ['fresh-cauliflower'] } });
  const categories = await Category.bulkWrite([
    { updateOne: { filter: { slug: 'vegetables' }, update: { $set: { name: 'Vegetables', icon: '🥬', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&q=85' } }, upsert: true } },
    { updateOne: { filter: { slug: 'plants' }, update: { $set: { name: 'Plants', icon: '🪴', image: 'https://images.pexels.com/photos/9707061/pexels-photo-9707061.jpeg' } }, upsert: true } },
    { updateOne: { filter: { slug: 'planters' }, update: { $set: { name: 'Planters', icon: '🪴', image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80' } }, upsert: true } }
    ,{ updateOne: { filter: { slug: 'gifting' }, update: { $set: { name: 'Gifting', icon: '🎁', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&q=85' } }, upsert: true } }
    ,{ updateOne: { filter: { slug: 'customize-gifting' }, update: { $set: { name: 'Customize Gifting', icon: '✨', image: 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?w=900&q=85' } }, upsert: true } }
  ]);
  const veg = await Category.findOne({ slug: 'vegetables' }); const plants = await Category.findOne({ slug: 'plants' }); const planters = await Category.findOne({ slug: 'planters' }); const gifting = await Category.findOne({ slug: 'gifting' });
  const products = [
    { name: 'Organic Spinach', slug: 'organic-spinach', category: veg._id, categoryName: veg.name, description: 'Farm-fresh organic spinach.', images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=900&q=85'], price: 49, mrp: 65, stock: 40, lowStockThreshold: 10, unit: '250g bunch' },
    { name: 'Money Plant', slug: 'money-plant', category: plants._id, categoryName: plants.name, description: 'A low-maintenance indoor plant.', images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=900&q=85'], price: 199, mrp: 249, stock: 15, lowStockThreshold: 5, unit: '1 plant' },
    { name: 'Fresh Red Tomatoes', slug: 'fresh-red-tomatoes', category: veg._id, categoryName: veg.name, description: 'Fresh, juicy red tomatoes sourced from local farms.', images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=900&q=85'], price: 79, mrp: 99, stock: 50, lowStockThreshold: 10, unit: '500g pack' }
    ,{ name: 'Terracotta Round Planter', slug: 'terracotta-round-planter', category: planters._id, categoryName: planters.name, description: 'Hand-finished terracotta planter for indoor and balcony plants.', images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=900&q=85'], price: 299, mrp: 399, stock: 24, lowStockThreshold: 5, unit: '1 planter' }
    ,{ name: 'Gift Money Plant Set', slug: 'gift-money-plant-set', category: gifting._id, categoryName: gifting.name, description: 'A ready-to-gift money plant paired with a premium planter.', images: ['https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=900&q=85'], price: 549, mrp: 699, stock: 18, lowStockThreshold: 5, unit: '1 gift set' }
    ,{ name: 'Gift Ceramic Planter', slug: 'gift-ceramic-planter', category: gifting._id, categoryName: gifting.name, description: 'Minimal ceramic planter, beautifully packed for gifting.', images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=900&q=85'], price: 449, mrp: 599, stock: 14, lowStockThreshold: 4, unit: '1 planter' }
    ,{ name: 'Snake Plant', slug: 'snake-plant', category: plants._id, categoryName: plants.name, description: 'A hardy air-purifying indoor plant with striking upright leaves.', images: ['https://images.pexels.com/photos/9707061/pexels-photo-9707061.jpeg'], price: 249, mrp: 329, stock: 22, lowStockThreshold: 5, unit: '1 plant' }
    ,{ name: 'Peace Lily Plant', slug: 'peace-lily-plant', category: plants._id, categoryName: plants.name, description: 'Elegant flowering indoor plant that brightens living spaces.', images: ['https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=900&q=85'], price: 349, mrp: 449, stock: 16, lowStockThreshold: 4, unit: '1 plant' }
    ,{ name: 'Matte White Ceramic Planter', slug: 'matte-white-ceramic-planter', category: planters._id, categoryName: planters.name, description: 'Modern matte-finish ceramic planter for desks and shelves.', images: ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=900&q=85'], price: 399, mrp: 499, stock: 20, lowStockThreshold: 5, unit: '1 planter' }
    ,{ name: 'Woven Basket Planter', slug: 'woven-basket-planter', category: planters._id, categoryName: planters.name, description: 'Warm woven basket planter that adds a natural touch indoors.', images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=900&q=85'], price: 499, mrp: 649, stock: 12, lowStockThreshold: 3, unit: '1 planter' }
    ,{ name: 'Ribbed Sage Planter', slug: 'ribbed-sage-planter', category: planters._id, categoryName: planters.name, description: 'Textured sage-green planter for a calm, contemporary space.', images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=900&q=85'], price: 349, mrp: 449, stock: 18, lowStockThreshold: 4, unit: '1 planter' }
    ,{ name: 'Hanging Macrame Planter', slug: 'hanging-macrame-planter', category: planters._id, categoryName: planters.name, description: 'Hand-knotted macrame hanger that brings plants beautifully off the shelf.', images: ['https://images.unsplash.com/photo-1597055181300-d7e4d8f5c1bd?w=900&q=85'], price: 599, mrp: 749, stock: 10, lowStockThreshold: 3, unit: '1 planter' }
    ,{ name: 'Speckled Stone Planter', slug: 'speckled-stone-planter', category: planters._id, categoryName: planters.name, description: 'Durable speckled stone-finish planter for indoor plants and succulents.', images: ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=900&q=85'], price: 429, mrp: 549, stock: 15, lowStockThreshold: 4, unit: '1 planter' }
    ,{ name: 'Blue Ceramic Window Planter', slug: 'blue-ceramic-window-planter', category: planters._id, categoryName: planters.name, description: 'Glossy blue ceramic planter designed for windowsills and desks.', images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=900&q=85'], price: 379, mrp: 499, stock: 14, lowStockThreshold: 4, unit: '1 planter' }
  ];
  for (const p of products) await Product.updateOne({ slug: p.slug }, { $set: p }, { upsert: true });
  const passwordHash = await bcrypt.hash('Admin@123', 12); await User.updateOne({ email: 'admin@greenroot.local' }, { $setOnInsert: { fullName: 'GreenRoot Admin', email: 'admin@greenroot.local', mobile: '9999999999', passwordHash, role: 'admin' } }, { upsert: true });
  console.log('Seed complete. Admin: admin@greenroot.local / Admin@123'); await mongoose.disconnect();
}
seed().catch(e => { console.error(e); process.exit(1); });
