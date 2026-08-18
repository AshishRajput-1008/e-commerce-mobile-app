const router = require('express').Router();
const { Address } = require('../models');
const { auth } = require('../middleware');
router.use(auth);
router.get('/', async (req, res, next) => { try { res.json({ success: true, data: await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 }).lean() }); } catch (e) { next(e); } });
router.post('/', async (req, res, next) => { try { const body = { ...req.body, user: req.user._id }; if (body.isDefault) await Address.updateMany({ user: req.user._id }, { isDefault: false }); const a = await Address.create(body); res.status(201).json({ success: true, data: a }); } catch (e) { next(e); } });
router.patch('/:id', async (req, res, next) => { try { if (req.body.isDefault) await Address.updateMany({ user: req.user._id }, { isDefault: false }); const a = await Address.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true, runValidators: true }); if (!a) return res.status(404).json({ success: false, message: 'Address not found' }); res.json({ success: true, data: a }); } catch (e) { next(e); } });
router.delete('/:id', async (req, res, next) => { try { await Address.deleteOne({ _id: req.params.id, user: req.user._id }); res.json({ success: true, data: null }); } catch (e) { next(e); } });
module.exports = router;
