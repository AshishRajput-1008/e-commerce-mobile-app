const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: { type: String, required: true, trim: true }, email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  mobile: { type: String, required: true, trim: true }, passwordHash: { type: String, required: true }, role: { type: String, enum: ['customer', 'admin'], default: 'customer' }
}, { timestamps: true });
const categorySchema = new Schema({ name: { type: String, required: true }, slug: { type: String, required: true, unique: true }, icon: String, image: String }, { timestamps: true });
const productSchema = new Schema({
  name: { type: String, required: true, trim: true }, slug: { type: String, required: true, unique: true }, description: String, category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, categoryName: String,
  images: [String], price: { type: Number, required: true, min: 0 }, mrp: { type: Number, required: true, min: 0 }, stock: { type: Number, required: true, min: 0, default: 0 }, lowStockThreshold: { type: Number, min: 0, default: 5 }, unit: String, organic: { type: Boolean, default: true }, rating: { type: Number, default: 0 }, reviews: { type: Number, default: 0 }, isActive: { type: Boolean, default: true }
}, { timestamps: true });
const addressSchema = new Schema({ user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, label: { type: String, default: 'Home' }, fullName: String, mobile: String, line1: { type: String, required: true }, line2: String, city: { type: String, required: true }, state: { type: String, required: true }, pincode: { type: String, required: true }, isDefault: { type: Boolean, default: false } }, { timestamps: true });
const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, items: [{ product: { type: Schema.Types.ObjectId, ref: 'Product' }, name: String, image: String, quantity: Number, price: Number, unit: String }], subtotal: Number, discount: { type: Number, default: 0 }, deliveryFee: { type: Number, default: 0 }, total: Number, paymentMethod: { type: String, enum: ['COD'], default: 'COD' }, status: { type: String, enum: ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'], default: 'placed' }, address: { fullName: String, mobile: String, line1: String, line2: String, city: String, state: String, pincode: String, label: String }
}, { timestamps: true });

module.exports = { User: mongoose.model('User', userSchema), Category: mongoose.model('Category', categorySchema), Product: mongoose.model('Product', productSchema), Address: mongoose.model('Address', addressSchema), Order: mongoose.model('Order', orderSchema) };
