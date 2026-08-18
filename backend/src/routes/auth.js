const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { auth, signToken } = require('../middleware');
const clean = (u) => ({ id: u._id, fullName: u.fullName, email: u.email, mobile: u.mobile, role: u.role });
router.post('/register', async (req, res, next) => { try { const { fullName, email, mobile, password } = req.body; if (!fullName || !email || !mobile || !password || password.length < 6) return res.status(400).json({ success: false, message: 'fullName, email, mobile and a 6+ character password are required' }); const exists = await User.findOne({ email: email.toLowerCase() }); if (exists) return res.status(409).json({ success: false, message: 'Email is already registered' }); const user = await User.create({ fullName, email, mobile, passwordHash: await bcrypt.hash(password, 12) }); res.status(201).json({ success: true, data: { user: clean(user), token: signToken(user) } }); } catch (e) { next(e); } });
router.post('/login', async (req, res, next) => { try { const user = await User.findOne({ email: String(req.body.email || '').toLowerCase() }); if (!user || !(await bcrypt.compare(req.body.password || '', user.passwordHash))) return res.status(401).json({ success: false, message: 'Invalid email or password' }); res.json({ success: true, data: { user: clean(user), token: signToken(user) } }); } catch (e) { next(e); } });
router.get('/me', auth, (req, res) => res.json({ success: true, data: clean(req.user) }));
module.exports = router;
