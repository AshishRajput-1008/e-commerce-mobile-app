const jwt = require('jsonwebtoken');
const { User } = require('./models');
function signToken(user) { return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' }); }
async function auth(req, res, next) { try { const value = req.headers.authorization || ''; if (!value.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Authentication required' }); const payload = jwt.verify(value.slice(7), process.env.JWT_SECRET || 'dev-secret'); req.user = await User.findById(payload.sub).select('-passwordHash'); if (!req.user) throw new Error(); next(); } catch { res.status(401).json({ success: false, message: 'Invalid or expired token' }); } }
function admin(req, res, next) { if (req.user?.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' }); next(); }
module.exports = { auth, admin, signToken };
